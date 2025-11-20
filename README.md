# Sistema Digiturno

Este es un sistema completo de gestión de turnos (Digiturno) que utiliza Google Sheets como base de datos y Google Apps Script como backend.

## 📂 Estructura

- `/public`: Contiene todos los archivos del frontend (HTML, CSS, JS). Esto es lo que debes subir a un hosting.
- `/backend`: Contiene el código `app.gs` que debes poner en Google Apps Script.

## 🚀 Instalación Paso a Paso

### 1. Backend (Google Sheets + Apps Script)

1.  Crea una nueva **Google Sheet** en tu Drive.
2.  Renombra la hoja "Hoja 1" a **"Turnos"**.
3.  En la primera fila (A1:F1), escribe estos encabezados exactos:
    `timestamp`, `nombre`, `correo`, `motivo`, `turno_asignado`, `estado`
4.  Ve al menú **Extensiones > Apps Script**.
5.  Borra el código que aparece y pega el contenido del archivo `backend/app.gs`.
6.  Guarda el proyecto (Ctrl+S).
7.  Haz clic en el botón azul **Implementar** (Deploy) > **Nueva implementación** (New deployment).
8.  Selecciona el tipo: **Aplicación web** (Web app).
    -   **Descripción:** "Digiturno API"
    -   **Ejecutar como:** "Yo" (Me)
    -   **Quién tiene acceso:** "Cualquier persona" (Anyone) -> *Importante para que funcione sin login de Google.*
9.  Copia la **URL de la aplicación web** generada (termina en `/exec`).

### 2. Frontend (Configuración)

1.  Abre el archivo `public/js/script.js`.
2.  Busca la línea: `let API_URL = localStorage.getItem('API_URL') || "YOUR_APPS_SCRIPT_URL_HERE";`
3.  Reemplaza la URL por la de tu Apps Script o usa la función `setAPIUrl('https://.../exec')` desde la consola del navegador cuando pruebes.

### 3. Despliegue (Hosting)

**Opción A: Vercel (Recomendado)**
1.  Instala Vercel CLI: `npm i -g vercel`
2.  Ejecuta el comando `vercel` en la carpeta raíz.
3.  Sigue las instrucciones. El archivo `vercel.json` ya está configurado para servir la carpeta `public`.

**Opción B: Manual**
Puedes subir la carpeta `public` a cualquier hosting estático gratuito:
-   **Netlify:** Arrastra la carpeta `public` a su dashboard.
-   **GitHub Pages:** Sube el código a un repo y activa Pages en la carpeta `public`.

## 🖥️ Visualización Local

# Sistema Digiturno

Este es un sistema completo de gestión de turnos (Digiturno) que utiliza Google Sheets como base de datos y Google Apps Script como backend.

## 📂 Estructura

- `/public`: Contiene todos los archivos del frontend (HTML, CSS, JS). Esto es lo que debes subir a un hosting.
- `/backend`: Contiene el código `app.gs` que debes poner en Google Apps Script.

## 🚀 Instalación Paso a Paso

### 1. Backend (Google Sheets + Apps Script)

1.  Crea una nueva **Google Sheet** en tu Drive.
2.  Renombra la hoja "Hoja 1" a **"Turnos"**.
3.  En la primera fila (A1:F1), escribe estos encabezados exactos:
    `timestamp`, `nombre`, `correo`, `motivo`, `turno_asignado`, `estado`
4.  Ve al menú **Extensiones > Apps Script**.
5.  Borra el código que aparece y pega el contenido del archivo `backend/app.gs`.
6.  Guarda el proyecto (Ctrl+S).
7.  Haz clic en el botón azul **Implementar** (Deploy) > **Nueva implementación** (New deployment).
8.  Selecciona el tipo: **Aplicación web** (Web app).
    -   **Descripción:** "Digiturno API"
    -   **Ejecutar como:** "Yo" (Me)
    -   **Quién tiene acceso:** "Cualquier persona" (Anyone) -> *Importante para que funcione sin login de Google.*
9.  Copia la **URL de la aplicación web** generada (termina en `/exec`).

### 2. Frontend (Configuración)

1.  Abre el archivo `public/script.js`.
2.  Busca la línea: `const API_URL = "YOUR_APPS_SCRIPT_URL_HERE";`
3.  Reemplaza el texto entre comillas con la URL que copiaste en el paso anterior.

### 3. Despliegue (Hosting)

**Opción A: Vercel (Recomendado)**
1.  Instala Vercel CLI: `npm i -g vercel`
2.  Ejecuta el comando `vercel` en la carpeta raíz.
3.  Sigue las instrucciones. El archivo `vercel.json` ya está configurado para servir la carpeta `public`.

**Opción B: Manual**
Puedes subir la carpeta `public` a cualquier hosting estático gratuito:
-   **Netlify:** Arrastra la carpeta `public` a su dashboard.
-   **GitHub Pages:** Sube el código a un repo y activa Pages en la carpeta `public`.

## 🖥️ Visualización Local

Para probar el sistema en tu computadora antes de subirlo:

1.  Haz doble clic en el archivo `preview.bat`.
2.  Esto abrirá un servidor local (usando Node.js o Python).
3.  Abre `http://localhost:3000` en tu navegador.

## 🚀 Uso

### Para el Cliente

1. Abre `public/html/login.html`.
2. Haz clic en "Entrar" e ingresa tu correo institucional (`@gestiondelriesgo.gov.co`).
3. Si no tienes un turno activo, serás redirigido a `public/html/index.html` para solicitar uno.
4. Si ya tienes un turno activo, serás redirigido automáticamente a `public/html/estado.html`.

### Panel Admin

- Abre `public/html/admin.html`.
- Credenciales por defecto de la jefe:
    - Correo: `isabel.arboleda@gestiondelriesgo.gov.co`
    - Contraseña: `OAPI2025!`

## 🛠️ Personalización

- Para configurar la URL del backend (Apps Script) abre `public/script.js` y reemplaza la constante `API_URL` con la URL `/exec` de tu despliegue de Apps Script.
- Para cambiar colores o estilos, edita `public/style.css`.

## Notas de seguridad

- Esta implementación usa una contraseña simple para el panel admin almacenada en `backend/app.gs`. Para producción considera usar mecanismos más seguros (OAuth o verificar usuarios mediante Directory API).
- No expongas contraseñas en repositorios públicos.

### Guardar la contraseña del admin en Properties (recomendado)

1. Abre el editor de Apps Script (en Google Sheets: Extensiones > Apps Script).
2. En el menú izquierdo selecciona "Project settings" (Ajustes del proyecto) o usa `PropertiesService` desde el editor.
3. En Script Properties añade una nueva clave:
    - Key: `ADMIN_PASS`
    - Value: `OAPI2025!` (o la contraseña que quieras usar)
4. Guarda.

La implementación actual leerá `ADMIN_PASS` de las Script Properties si existe; en caso contrario usará la constante embebida en `backend/app.gs`.

Esto evita poner la contraseña directamente en el código fuente del proyecto.
