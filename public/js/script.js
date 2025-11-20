/**
 * Digiturno Frontend Logic
 */

// CONFIGURACIÓN: Puedes establecer la URL del Apps Script aquí o en tiempo de ejecución.
// Ejemplo: "https://script.google.com/macros/s/AKfycbx.../exec"
// Default API URL (Apps Script) - set to provided deployment URL.
let API_URL = localStorage.getItem('API_URL') || "https://script.google.com/macros/s/AKfycbxSZZkKH_4qz1g-c6Dje0gSZdOSLGSoJ9Z4cNCjVl6QiQ3JmH0LO35Hmnv9Qx2U-9ffug/exec";

// MODO MOCK: Si es true, simula respuestas sin llamar al backend real.
// Útil para probar el diseño antes de tener el backend listo.
// PARA PRUEBAS LOCALES: poner MOCK_MODE=false para usar el backend real.
const MOCK_MODE = false;

const App = {
    async callAPI(action, data = {}) {
        if (MOCK_MODE) return this.mockAPI(action, data);

        try {
            const options = {
                method: 'POST',
                mode: 'cors',
                headers: {
                    'Content-Type': 'text/plain;charset=utf-8',
                },
                body: JSON.stringify({ action, ...data })
            };

            // For GET-like requests we use query params to simplify GAS handling
            if (action === 'estadoTurnos' || action === 'turno' || action === 'checkSession') {
                const params = new URLSearchParams({ action, ...data });
                const response = await fetch(`${API_URL}?${params}`);
                return await response.json();
            }

            const response = await fetch(API_URL, options);
            return await response.json();
        } catch (err) {
            console.error('API error', err);
            return { status: 'error', message: 'Error de conexión con el backend' };
        }
    },

    mockAPI(action, data) {
        return new Promise(resolve => {
            setTimeout(() => {
                console.log(`[MOCK] Action: ${action}`, data);
                if (action === 'crearTurno') {
                    resolve({ status: 'success', turno: Math.floor(Math.random() * 100) + 1 });
                } else if (action === 'estadoTurnos') {
                    resolve({
                        status: 'success',
                        turno_actual: { turno: 42, nombre: "Juan Pérez", estado: "LLAMADO" },
                        total_en_espera: 5,
                        lista_espera: [{ turno: 43, nombre: "Ana", correo: "a@a.com", motivo: "X" }]
                    });
                } else if (action === 'turno') {
                    resolve({
                        status: 'success',
                        turno: { numero: data.numero, nombre: "Yo", estado: "EN_ESPERA" }
                    });
                } else if (action === 'adminLogin') {
                    resolve({ status: 'success' });
                } else {
                    resolve({ status: 'success' });
                }
            }, 500);
        });
    },

    saveTurno(turno) {
        localStorage.setItem('mi_turno', String(turno));
    },

    getTurno() {
        return localStorage.getItem('mi_turno');
    },

    clearTurno() {
        localStorage.removeItem('mi_turno');
        localStorage.removeItem('user_email');
    }
};

// Utilities for the UI
window.setAPIUrl = function (url) {
    API_URL = url;
    localStorage.setItem('API_URL', url);
    showToast('API URL guardada', 'info');
};

window.showToast = function (message, type = 'info') {
    const id = 'toast-container';
    let container = document.getElementById(id);
    if (!container) {
        container = document.createElement('div');
        container.id = id;
        container.style.position = 'fixed';
        container.style.right = '1rem';
        container.style.bottom = '1rem';
        container.style.zIndex = 9999;
        document.body.appendChild(container);
    }

    const el = document.createElement('div');
    el.className = 'toast toast-' + type;
    el.textContent = message;
    container.appendChild(el);

    setTimeout(() => {
        el.style.opacity = '0';
        setTimeout(() => container.removeChild(el), 400);
    }, 3500);
};

window.playNotify = function () {
    try {
        const osc = new (window.AudioContext || window.webkitAudioContext)();
        const o = osc.createOscillator();
        const g = osc.createGain();
        o.type = 'sine';
        o.frequency.value = 880;
        o.connect(g);
        g.connect(osc.destination);
        g.gain.value = 0.05;
        o.start();
        setTimeout(() => { o.stop(); osc.close(); }, 200);
    } catch (e) {
        // ignore
    }
};
