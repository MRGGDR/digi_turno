/**
 * Digiturno Backend - Google Apps Script
 * 
 * INSTRUCCIONES DE INSTALACIÓN:
 * 1. Crea una nueva Google Sheet.
 * 2. Renombra la hoja "Hoja 1" a "Turnos".
 * 3. En la primera fila (encabezados) pon: timestamp, nombre, correo, motivo, turno_asignado, estado
 * 4. Ve a Extensiones > Apps Script.
 * 5. Pega este código en Code.gs.
 * 6. Guarda y despliega como Aplicación Web (Deploy > New Deployment > Web App).
 *    - Execute as: Me
 *    - Who has access: Anyone (o Anyone with Google account si es interno)
 * 7. Copia la URL del script desplegado y úsala en el frontend.
 */

const SHEET_NAME = "Turnos";
const ALLOWED_DOMAIN = "@gestiondelriesgo.gov.co";
// Lista de correos permitidos para admin
const ADMIN_EMAILS = ["isabel.arboleda@gestiondelriesgo.gov.co"];
// Contraseña administrativa requerida para acceder al panel de la jefe
// Por seguridad se puede guardar en PropertiesService (Script Properties) con la clave 'ADMIN_PASS'.
const ADMIN_PASS = "OAPI2025!";

function getAdminPass() {
  try {
    const props = PropertiesService.getScriptProperties();
    const p = props.getProperty('ADMIN_PASS');
    if (p && p.length > 0) return p;
  } catch (e) {
    // En entornos donde PropertiesService no esté disponible, usamos la constante.
  }
  return ADMIN_PASS;
}

function doGet(e) {
  const action = e.parameter.action;
  
  if (action === "estadoTurnos") {
    return getEstadoTurnos();
  } else if (action === "turno") {
    return getTurno(e.parameter.numero);
  } else if (action === "checkSession") {
    return checkSession(e.parameter.correo);
  }
  
  return responseJSON({ status: "error", message: "Acción no válida" });
}

function doPost(e) {
  let data;
  try {
    data = JSON.parse(e.postData.contents);
  } catch (err) {
    data = e.parameter;
  }

  const action = data.action;

  if (action === "crearTurno") {
    return crearTurno(data);
  } else if (action === "llamarSiguiente") {
    return llamarSiguiente(data);
  } else if (action === "finalizarTurno") {
    return finalizarTurno(data);
  } else if (action === "adminLogin") {
    return adminLogin(data);
  }

  return responseJSON({ status: "error", message: "Acción no válida" });
}

function getSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(["timestamp", "nombre", "correo", "motivo", "turno_asignado", "estado"]);
  }
  return sheet;
}

function crearTurno(data) {
  // 1. Validar dominio
  if (!data.correo || !data.correo.endsWith(ALLOWED_DOMAIN)) {
    return responseJSON({ status: "error", message: `Solo se permiten correos ${ALLOWED_DOMAIN}` });
  }

  const sheet = getSheet();
  const rows = sheet.getDataRange().getValues();
  
  // 2. Verificar si ya tiene turno activo
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    const correo = row[2];
    const estado = row[5];
    
    if (correo === data.correo && (estado === "EN_ESPERA" || estado === "LLAMADO" || estado === "ATENDIENDO")) {
      return responseJSON({ 
        status: "success", 
        message: "Ya tienes un turno activo", 
        turno: row[4],
        restored: true 
      });
    }
  }

  // 3. Crear nuevo turno
  const lastRow = sheet.getLastRow();
  let siguienteTurno = 1;
  if (lastRow > 1) {
    const lastTurno = sheet.getRange(lastRow, 5).getValue();
    if (typeof lastTurno === 'number') {
      siguienteTurno = lastTurno + 1;
    }
  }

  const timestamp = new Date();
  const estado = "EN_ESPERA";
  
  sheet.appendRow([timestamp, data.nombre, data.correo, data.motivo, siguienteTurno, estado]);
  
  return responseJSON({ status: "success", turno: siguienteTurno });
}

function checkSession(correo) {
  if (!correo) return responseJSON({ status: "error", message: "Correo requerido" });
  
  const sheet = getSheet();
  const rows = sheet.getDataRange().getValues();
  
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    if (row[2] === correo && (row[5] === "EN_ESPERA" || row[5] === "LLAMADO" || row[5] === "ATENDIENDO")) {
      return responseJSON({ status: "success", hasTurno: true, turno: row[4] });
    }
  }
  
  return responseJSON({ status: "success", hasTurno: false });
}

function adminLogin(data) {
  // Validar correo en lista blanca
  if (!data.correo || !ADMIN_EMAILS.includes(data.correo)) {
    return responseJSON({ status: "error", message: "Este correo no tiene permisos de administrador" });
  }

  const expected = getAdminPass();
  if (data.password === expected) {
    return responseJSON({ status: "success" });
  } else {
    return responseJSON({ status: "error", message: "Contraseña incorrecta" });
  }
}

function getEstadoTurnos() {
  const sheet = getSheet();
  const data = sheet.getDataRange().getValues();
  
  let current = null;
  let waitingCount = 0;
  let activeList = [];

  data.forEach(row => {
    const t = {
      turno: row[4],
      nombre: row[1],
      correo: row[2],
      motivo: row[3],
      estado: row[5]
    };
    
    if (t.estado === "LLAMADO" || t.estado === "ATENDIENDO") {
      current = t;
    } else if (t.estado === "EN_ESPERA") {
      waitingCount++;
      activeList.push(t);
    }
  });

  return responseJSON({
    status: "success",
    turno_actual: current,
    total_en_espera: waitingCount,
    lista_espera: activeList // Devolvemos toda la lista para el admin
  });
}

function llamarSiguiente(data) {
  // Opcional: Validar que quien llama es admin (data.adminEmail)
  const sheet = getSheet();
  const rows = sheet.getDataRange().getValues();
  
  // 1. Finalizar el actual si existe
  for (let i = 1; i < rows.length; i++) {
    if (rows[i][5] === "LLAMADO" || rows[i][5] === "ATENDIENDO") {
      sheet.getRange(i + 1, 6).setValue("FINALIZADO");
    }
  }
  
  // 2. Buscar el siguiente EN_ESPERA
  let found = null;
  for (let i = 1; i < rows.length; i++) {
    if (rows[i][5] === "EN_ESPERA") {
      sheet.getRange(i + 1, 6).setValue("LLAMADO");
      found = rows[i][4];
      break;
    }
  }
  
  if (found) {
    return responseJSON({ status: "success", message: "Siguiente turno llamado", turno: found });
  } else {
    return responseJSON({ status: "success", message: "No hay turnos en espera" });
  }
}

function finalizarTurno(data) {
  const sheet = getSheet();
  const rows = sheet.getDataRange().getValues();
  
  for (let i = 1; i < rows.length; i++) {
    if (rows[i][5] === "LLAMADO" || rows[i][5] === "ATENDIENDO") {
      sheet.getRange(i + 1, 6).setValue("FINALIZADO");
    }
  }
  
  return responseJSON({ status: "success", message: "Turno finalizado" });
}

function getTurno(numero) {
  const sheet = getSheet();
  const rows = sheet.getDataRange().getValues();
  
  for (let i = 1; i < rows.length; i++) {
    if (rows[i][4] == numero) {
      return responseJSON({ 
        status: "success", 
        turno: {
          numero: rows[i][4],
          nombre: rows[i][1],
          estado: rows[i][5]
        }
      });
    }
  }
  
  return responseJSON({ status: "error", message: "Turno no encontrado" });
}

function responseJSON(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
