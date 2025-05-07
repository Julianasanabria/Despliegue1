const form = document.getElementById('registro-form');
const alerta = document.getElementById('alerta');
const vistaFormulario = document.getElementById('vista-formulario');
const vistaTabla = document.getElementById('vista-tabla');
const tabla = document.getElementById('tabla-datos').querySelector('tbody');

// Función para cambiar vistas
function mostrarVista(vista) {
    if (vista === 'formulario') {
        vistaFormulario.classList.remove('oculto');
        vistaTabla.classList.add('oculto');
    } else {
        vistaFormulario.classList.add('oculto');
        vistaTabla.classList.remove('oculto');
    }
}

// Inicialización: ocultar tabla si no hay registros
window.addEventListener('load', () => {
    if (!tabla.hasChildNodes()) {
        mostrarVista('formulario');
        vistaTabla.classList.add('oculto');
    } else {
        mostrarVista('tabla');
    }
});

let contadorItems = 1;
let filaEnEdicion = null;

function actualizarRegistro(itemId) {
    const fila = document.querySelector(`tr[data-id="${itemId}"]`);
    filaEnEdicion = itemId;
    
    // Obtener datos de la fila
    const celdas = fila.querySelectorAll('td');
    
    // Llenar el formulario con datos existentes
    document.getElementById('nombres').value = celdas[1].textContent;
    document.getElementById('apellidos').value = celdas[2].textContent;
    document.getElementById('opcion').value = celdas[3].textContent;
    document.getElementById('documento').value = celdas[4].textContent;
    document.getElementById('email').value = celdas[5].textContent;
    document.getElementById('fecha').value = celdas[6].textContent;
    
    const genero = celdas[7].textContent.toLowerCase();
    document.querySelector(`input[name="genero"][value="${genero}"]`).checked = true;
    
    // Cambiar texto del botón para indicar actualización
    document.querySelector('button[type="submit"]').textContent = 'ACTUALIZAR';
    mostrarVista('formulario');
}

form.addEventListener('submit', function(event) {
    event.preventDefault();

    // Validaciones existentes...
    const campos = {
        nombres: document.getElementById('nombres').value.trim(),
        apellidos: document.getElementById('apellidos').value.trim(),
        opcion: document.getElementById('opcion').value,
        documento: document.getElementById('documento').value.trim(),
        email: document.getElementById('email').value.trim(),
        fecha: document.getElementById('fecha').value,
        genero: document.querySelector('input[name="genero"]:checked')?.value || ''
    };

    // Validación de campos
    const camposFaltantes = [];
    Object.entries(campos).forEach(([key, value]) => {
        if (!value) camposFaltantes.push(key.charAt(0).toUpperCase() + key.slice(1));
    });

    if (camposFaltantes.length > 0) {
        mostrarAlerta(`<strong>Error:</strong> Faltan los siguientes campos:<br>• ${camposFaltantes.join('<br>• ')}`, 'error');
        return;
    }

    if (filaEnEdicion) {
        // Actualizar fila existente
        const fila = document.querySelector(`tr[data-id="${filaEnEdicion}"]`);
        fila.innerHTML = generarContenidoFila(filaEnEdicion, campos);
        mostrarAlerta('<strong>Éxito:</strong> Registro actualizado correctamente', 'exito');
    } else {
        // Crear nueva fila
        const fila = document.createElement('tr');
        fila.setAttribute('data-id', contadorItems);
        fila.innerHTML = generarContenidoFila(contadorItems, campos);
        tabla.prepend(fila);
        contadorItems++;
        mostrarAlerta('<strong>Éxito:</strong> Registro agregado correctamente', 'exito');
    }

    form.reset();
    setTimeout(() => mostrarVista('tabla'), 1000);
});

function crearNuevoRegistro() {
    filaEnEdicion = null;
    form.reset();
    document.querySelector('button[type="submit"]').textContent = 'ENVIAR';
    mostrarVista('formulario');
}

function generarContenidoFila(id, campos) {
    return `
        <td>${id}</td>
        <td>${campos.nombres}</td>
        <td>${campos.apellidos}</td>
        <td>${campos.opcion}</td>
        <td>${campos.documento}</td>
        <td>${campos.email}</td>
        <td>${campos.fecha}</td>
        <td>${campos.genero}</td>
        <td class="acciones">
            <button onclick="crearNuevoRegistro()" class="btn-accion crear" title="Nuevo registro">➕</button>
            <button onclick="actualizarRegistro(${id})" class="btn-accion editar" title="Editar">✏️</button>
            <button onclick="eliminarFila(this)" class="btn-accion eliminar" title="Eliminar">🗑️</button>
        </td>
    `;
}

function mostrarAlerta(mensaje, tipo) {
    alerta.innerHTML = mensaje;
    alerta.className = `alerta ${tipo} visible`;

    setTimeout(() => {
        alerta.className = `alerta ${tipo} oculto`;
    }, 3000);
}

let filaAEliminar = null;

function eliminarFila(btn) {
    filaAEliminar = btn.closest('tr');
    const modal = document.getElementById('confirmar-eliminar');
    modal.classList.remove('oculto');
    modal.classList.add('visible');
}

document.getElementById('btn-confirmar').addEventListener('click', function() {
    if (filaAEliminar) {
        // Eliminar inmediatamente la fila
        filaAEliminar.remove();
        mostrarAlerta('<strong>Éxito:</strong> Registro eliminado correctamente', 'exito');
        
        // Verificar si la tabla está vacía
        if (tabla.children.length === 0) {
            setTimeout(() => {
                mostrarVista('formulario');
            }, 500);
        }
    }
    cerrarModal();
});

function cerrarModal() {
    const modal = document.getElementById('confirmar-eliminar');
    modal.classList.remove('visible');
    modal.classList.add('oculto');
    filaAEliminar = null;
}
