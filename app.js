// =========================================
// GUARDAR Y CARGAR DATOS CON localStorage
// =========================================

const CLAVE = 'recibo-greenblue-0483';

function obtenerDatos() {
  // Campos de input normales
  const campos = ['nombre','telefono','ciudad','direccion','edad','peso','talla',
                  'fi-d','fi-m','fi-a','ff-d','ff-m','ff-a','total','observaciones'];
  const datos = {};

  campos.forEach(id => {
    const el = document.getElementById(id);
    if (el) datos[id] = el.value;
  });

  // Número de recibo (contenteditable)
  const numEl = document.getElementById('recibo-num');
  if (numEl) datos['recibo-num'] = numEl.innerText.trim();

  // Checkboxes
  datos['chk-rehab'] = document.getElementById('chk-rehab').checked;
  datos['chk-entre'] = document.getElementById('chk-entre').checked;
  datos['chk-masa']  = document.getElementById('chk-masa').checked;
  datos['chk-nata']  = document.getElementById('chk-nata').checked;

  // Filas de la tabla
  const filas = document.querySelectorAll('#tbody tr');
  datos.tabla = [];
  filas.forEach(fila => {
    const celdas = fila.querySelectorAll('td');
    datos.tabla.push([
      celdas[0].innerText,
      celdas[1].innerText,
      celdas[2].innerText
    ]);
  });

  return datos;
}

function aplicarDatos(datos) {
  const campos = ['nombre','telefono','ciudad','direccion','edad','peso','talla',
                  'fi-d','fi-m','fi-a','ff-d','ff-m','ff-a','total','observaciones'];

  campos.forEach(id => {
    const el = document.getElementById(id);
    if (el && datos[id] !== undefined) el.value = datos[id];
  });

  const numEl = document.getElementById('recibo-num');
  if (numEl && datos['recibo-num']) numEl.innerText = datos['recibo-num'];

  if (datos['chk-rehab'] !== undefined) document.getElementById('chk-rehab').checked = datos['chk-rehab'];
  if (datos['chk-entre'] !== undefined) document.getElementById('chk-entre').checked = datos['chk-entre'];
  if (datos['chk-masa']  !== undefined) document.getElementById('chk-masa').checked  = datos['chk-masa'];
  if (datos['chk-nata']  !== undefined) document.getElementById('chk-nata').checked  = datos['chk-nata'];

  if (datos.tabla) {
    const filas = document.querySelectorAll('#tbody tr');
    datos.tabla.forEach((fila, i) => {
      if (filas[i]) {
        const celdas = filas[i].querySelectorAll('td');
        celdas[0].innerText = fila[0] || '';
        celdas[1].innerText = fila[1] || '';
        celdas[2].innerText = fila[2] || '';
      }
    });
  }
}

function guardarDatos() {
  const datos = obtenerDatos();
  localStorage.setItem(CLAVE, JSON.stringify(datos));
  const estado = document.getElementById('estado');
  const ahora = new Date();
  const hora = ahora.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' });
  estado.textContent = `✅ Guardado a las ${hora}`;
  estado.style.color = '#88ffaa';
  setTimeout(() => {
    estado.textContent = 'Sin cambios nuevos';
    estado.style.color = '#aad0ff';
  }, 3000);
}

function limpiarDatos() {
  if (!confirm('¿Seguro que quieres borrar todos los datos del recibo?')) return;
  localStorage.removeItem(CLAVE);
  location.reload();
}

function marcarCambio() {
  const estado = document.getElementById('estado');
  estado.textContent = '⚠ Cambios sin guardar — presiona Guardar';
  estado.style.color = '#ffdd88';
}

// Cargar al abrir
window.addEventListener('DOMContentLoaded', () => {
  const guardado = localStorage.getItem(CLAVE);
  if (guardado) {
    try {
      aplicarDatos(JSON.parse(guardado));
      const estado = document.getElementById('estado');
      estado.textContent = '✅ Datos cargados';
      estado.style.color = '#88ffaa';
      setTimeout(() => {
        estado.textContent = 'Sin cambios nuevos';
        estado.style.color = '#aad0ff';
      }, 2000);
    } catch(e) {
      console.error('Error al cargar datos:', e);
    }
  }

  // Escuchar cambios en todos los inputs/textareas
  document.querySelectorAll('input, textarea').forEach(el => {
    el.addEventListener('input', marcarCambio);
    el.addEventListener('change', marcarCambio);
  });

  // Escuchar cambios en contenteditable (tabla y número)
  document.querySelectorAll('[contenteditable]').forEach(el => {
    el.addEventListener('input', marcarCambio);
  });

  // Guardar con Ctrl+S
  document.addEventListener('keydown', e => {
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault();
      guardarDatos();
    }
  });
});
