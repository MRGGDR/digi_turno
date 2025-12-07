<div align="center">
  <img src="public/img/DIGITURNO.png" alt="DIGITURNO Banner" width="100%">

  # DIGITURNO

  ### Sistema de Gestión de Turnos - Oficina Asesora de Planeación e Información

  [**Ir a la Aplicación**](https://digi-turno.vercel.app)

  [![Version](https://img.shields.io/badge/version-1.0.0-blue.svg?style=flat-square)](https://github.com/MRGGDR/digi_turno)
  [![Actualización](https://img.shields.io/badge/actualización-06%2F12%2F2025-green.svg?style=flat-square)](https://github.com/MRGGDR/digi_turno)
</div>

---

## Resumen Ejecutivo

<div align="center">
  <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" />
  <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" />
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" />
  <img src="https://img.shields.io/badge/Google_Apps_Script-4285F4?style=for-the-badge&logo=google&logoColor=white" />
  <img src="https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" />
</div>
<br>

**DIGITURNO** es una aplicación web ágil y directa diseñada para la **Oficina Asesora de Planeación e Información**. Su función principal es gestionar la solicitud de citas o turnos para hablar con la Jefe de la Oficina de manera organizada.

Esta herramienta simplifica el proceso de agendamiento, eliminando intermediarios innecesarios y centralizando las solicitudes en un sistema digital fácil de usar.

---

## Tabla de Contenidos

1.  [Descripción de la Herramienta](#1-descripción-de-la-herramienta)
2.  [Propósito](#2-propósito)
3.  [Información Técnica](#3-información-técnica)
4.  [Instalación y Configuración](#4-instalación-y-configuración)

---

## 1. Descripción de la Herramienta

DIGITURNO es un "digiturno" literal. Permite a los colaboradores y funcionarios solicitar un espacio para conversar con la jefatura. El sistema gestiona una cola de atención sencilla, garantizando que cada solicitud sea atendida en orden y con la trazabilidad necesaria.

### Funcionalidades Clave
*   **Solicitud de Turno:** Formulario simple para pedir la cita.
*   **Visualización de Estado:** Pantalla para ver el turno actual y la lista de espera.
*   **Gestión Administrativa:** Panel básico para que la jefatura avance los turnos.

---

## 2. Propósito

El propósito es optimizar el tiempo de la jefatura y de los colaboradores, evitando las interrupciones desorganizadas y las filas físicas. Permite saber cuándo es el momento adecuado para acercarse a hablar, respetando el flujo de trabajo de la oficina.

---

## 3. Información Técnica

El proyecto está construido con una arquitectura ligera y eficiente, separando el frontend del backend lógico.

*   **Frontend:** HTML5, CSS3 y JavaScript puro (Vanilla JS). Se aloja en Vercel para una entrega rápida.
*   **Backend:** Google Apps Script (`app.gs`). Actúa como el motor lógico y base de datos (usando hojas de cálculo de Google o propiedades del script) para almacenar los turnos.

### Estructura del Proyecto

```text
turnos_jefe/
├── backend/
│   └── app.gs              # Lógica del servidor (Google Apps Script)
├── public/                 # Archivos estáticos del Frontend
│   ├── css/
│   │   └── style.css       # Estilos de la aplicación
│   ├── html/               # Vistas (Admin, Cliente, Pantalla, etc.)
│   ├── js/                 # Lógica del cliente
│   └── img/
│       └── DIGITURNO.png   # Banner del proyecto
└── vercel.json             # Configuración de despliegue
```

---

## 4. Instalación y Configuración

### Prerrequisitos
*   Cuenta de Google (para el backend).
*   Cuenta de Vercel (para el frontend).

### Pasos Básicos

1.  **Backend (Apps Script):**
    *   Subir el archivo `backend/app.gs` a un nuevo proyecto de Google Apps Script.
    *   Implementar como "Aplicación web" con acceso "Cualquiera" (Any) o "Cualquiera con cuenta de Google" según se requiera.
    *   Copiar la URL del script desplegado.

2.  **Frontend:**
    *   Configurar la URL del backend en los archivos JavaScript del cliente (carpeta `public/js`).
    *   Desplegar la carpeta raíz en Vercel o cualquier servidor estático.

---

<div align="center">
  <sub>Desarrollado para la Oficina Asesora de Planeación e Información</sub>
</div>
