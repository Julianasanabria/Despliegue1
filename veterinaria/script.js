document.addEventListener('DOMContentLoaded', function () {

    // Botón principal ahora abre el modal de búsqueda
    document.getElementById('botonPrincipal').onclick = function() {
        document.getElementById('modalParaBusquedaCita').classList.add('activo');
        // Limpiar el campo de búsqueda y renderizar todas las citas al abrir
        const inputBusqueda = document.getElementById('inputBusqueda');
        if (inputBusqueda) {
            inputBusqueda.value = ''; 
        }
        renderizar_tarjetas_citas(lista_citas); // Mostrar todas las citas inicialmente
    };

    // Cerrar el modal de búsqueda
    const modalParaBusquedaCita = document.getElementById('modalParaBusquedaCita');
    if (modalParaBusquedaCita) {
        const btnCerrarModalBusqueda = modalParaBusquedaCita.querySelector('.cerrar');
        if (btnCerrarModalBusqueda) {
            btnCerrarModalBusqueda.onclick = function() {
                modalParaBusquedaCita.classList.remove('activo');
            };
        }
    }

    // Mapeo de tipo de animal a imagen
    const fotos_animales = {
        "Conejo": "https://www.shutterstock.com/image-photo/cute-rabbit-black-background-260nw-2347125921.jpg",
        "Perro": "https://img.freepik.com/foto-gratis/vista-frontal-lindo-perro-sentado_23-2148423626.jpg?semt=ais_hybrid&w=740",
        "Gato": "https://img.freepik.com/fotos-premium/gatito-abstracto-sobre-fondo-negro_173948-5935.jpg",
        "Hamsters": "https://png.pngtree.com/thumb_back/fw800/background/20230424/pngtree-hamster-on-a-black-background-image_2556617.jpg",
        "Loros": "https://img.pikbest.com/ai/illus_our/20230426/c916f93ceefe70e511d6db5b9b0d7868.jpg!w700wp",
        "Canarios": "https://thumbs.dreamstime.com/b/p%C3%A1jaro-canario-ex%C3%B3tico-sobre-fondo-negro-con-pie-turquesa-y-gafas-brit%C3%A1nicas-un-vibrante-plumas-azules-amarillas-se-apoya-302230935.jpg",
        "Tortugas": "https://img.freepik.com/vector-premium/retrato-gran-tortuga-marina-sobre-fondo-negro-ilustracion_291138-225.jpg",
        "Serpientes": "https://img.freepik.com/fotos-premium/serpiente-fondo-negro_248616-593.jpg",
        "Peces de agua dulce": "https://media.istockphoto.com/id/508695944/es/foto/pez-betta-doble-aislado-sobre-fondo-negro.jpg?s=612x612&w=0&k=20&c=dFPvr17_Uv9bs8g-T5F98u-AKQg8wKcOJ0JiT0x7_0g=",
        "Peces de agua salada": "https://img.freepik.com/fotos-premium/pez-luchador-siames-saltando-salpicaduras-agua_328278-61.jpg"
    };

    // Abre el modal de agendar cita
    function abrir_modal_agendar_cita() {
        document.getElementById('modalAgendarCita').classList.add('activo');
    }

    // Cierra todos los modales activos
    function cerrar_modales() {
        document.querySelectorAll('.modal.activo').forEach(function (modal) {
            modal.classList.remove('activo');
        });
        // Asegurarse de que el modal de búsqueda también se cierre si está activo
        const modalBusqueda = document.getElementById('modalParaBusquedaCita');
        if (modalBusqueda && modalBusqueda.classList.contains('activo')) {
            modalBusqueda.classList.remove('activo');
        }
    }

    // Cierra solo el modal de agendar cita
    function cerrar_modal_formulario() {
        document.getElementById('modalAgendarCita').classList.remove('activo');
    }

    // Cierra solo el modal de alerta
    function cerrar_modal_alerta() {
        document.getElementById('modalCitaInfo').classList.remove('activo');
    }

    // Nueva función para mostrar los campos faltantes
    function obtener_campos_faltantes({ nombre_mascota, propietario, telefono, fecha_cita, tipo_mascota, sintomas }) {
        const campos = [];
        if (!nombre_mascota) campos.push("Nombre de tu mascota");
        if (!propietario) campos.push("Nombre del Propietario");
        if (!telefono) campos.push("Teléfono");
        if (!fecha_cita) campos.push("Fecha de la cita");
        if (!tipo_mascota) campos.push("Tipo de mascota");
        if (!sintomas) campos.push("Síntomas");
        return campos;
    }

    // Estado global de citas
    let lista_citas = [];
    let contador_citas = 1;
    let id_cita_editando = null;

    // Estados posibles
    const estados_cita = ["Abierta", "Terminada", "Anulada"];

    // --- Validaciones adicionales ---
    function validar_telefono(telefono) {
        return /^\d+$/.test(telefono);
    }
    function validar_sintomas(sintomas) {
        return sintomas.length <= 400;
    }
    function validar_horario(fecha) {
        const hora = fecha.getHours();
        return hora >= 8 && hora < 20;
    }

    // --- Manejo de edición y eliminación ---
    function abrir_modal_editar_cita(id) {
        const cita = lista_citas.find(c => c.id === id);
        if (!cita) return;
        id_cita_editando = id;
        // Llena el formulario con los datos de la cita
        const formulario = document.querySelector('.formulario');
        if (!formulario) return;
        formulario.querySelector('input[placeholder="Nombre de tu mascota"]').value = cita.nombre_mascota;
        formulario.querySelector('input[placeholder="Nombre del Propietario"]').value = cita.propietario;
        formulario.querySelector('input[placeholder="Teléfono"]').value = cita.telefono;
        formulario.querySelector('#fechaCita').value = cita.fecha_cita_input;
        formulario.querySelector('select').value = cita.tipo_mascota;
        formulario.querySelector('textarea').value = cita.sintomas;
        abrir_modal_agendar_cita();
    }

    function abrir_modal_eliminar_cita(id) {
        const modal = document.getElementById('modalCitaInfo');
        const info_cita = document.getElementById('infoCita');
        info_cita.innerHTML = `
            <h2>Confirmar eliminación</h2>
            <p>¿Estás seguro de eliminar esta cita?</p>
            <button id="confirmarEliminarCita" style="background:#d9534f;color:#fff;">Eliminar</button>
            <button class="cerrar-alerta">Cancelar</button>
        `;
        info_cita.className = tipos_alertas.advertencia.clase;
        document.getElementById('confirmarEliminarCita').onclick = function () {
            eliminar_cita(id);
            cerrar_modal_alerta();
        };
        // Solo cierra la alerta
        info_cita.querySelector('.cerrar-alerta').onclick = cerrar_modal_alerta;
        modal.classList.add('activo');
    }

    function eliminar_cita(id) {
        lista_citas = lista_citas.filter(c => c.id !== id);
        renderizar_tarjetas_citas(lista_citas);
    }

    function cambiar_estado_cita(id, nuevo_estado) {
        const cita = lista_citas.find(c => c.id === id);
        if (cita) {
            cita.estado = nuevo_estado;
            renderizar_tarjetas_citas(lista_citas);
        }
    }

    // Maneja el envío del formulario de cita
    function manejar_formulario_cita(evento) {
        evento.preventDefault();
        const formulario = evento.target;
        const nombre_mascota = formulario.querySelector('input[placeholder="Nombre de tu mascota"]').value.trim();
        const propietario = formulario.querySelector('input[placeholder="Nombre del Propietario"]').value.trim();
        const telefono = formulario.querySelector('input[placeholder="Teléfono"]').value.trim();
        const fecha_cita = formulario.querySelector('#fechaCita').value;
        const tipo_mascota = formulario.querySelector('select').value;
        const sintomas = formulario.querySelector('textarea').value.trim();

        // Validar campos vacíos
        if (!nombre_mascota || !propietario || !telefono || !fecha_cita || !tipo_mascota || !sintomas) {
            const faltantes = obtener_campos_faltantes({ nombre_mascota, propietario, telefono, fecha_cita, tipo_mascota, sintomas });
            mostrar_alerta(
                'Error',
                'Debes llenar los siguientes campos:<br><ul style="text-align:left;">' +
                faltantes.map(c => `<li>${c}</li>`).join('') +
                '</ul>',
                'error'
            );
            return;
        }
        // Validar teléfono
        if (!validar_telefono(telefono)) {
            mostrar_alerta('Error', 'El teléfono debe contener solo números.', 'error');
            return;
        }
        // Validar síntomas
        if (!validar_sintomas(sintomas)) {
            mostrar_alerta('Error', 'Los síntomas no pueden superar los 400 caracteres.', 'error');
            return;
        }
        // Validar fecha
        const fecha_ingresada = new Date(fecha_cita);
        const ahora = new Date();
        if (isNaN(fecha_ingresada.getTime())) {
            mostrar_alerta('Error', 'Selecciona una fecha válida.', 'error');
            return;
        }
        if (fecha_ingresada <= ahora) {
            mostrar_alerta('Error', 'La fecha y hora deben ser posteriores a la actual.', 'error');
            return;
        }
        // Validar horario de atención
        if (!validar_horario(fecha_ingresada)) {
            mostrar_alerta('Error', 'El horario de atención es de 8:00 a.m. a 8:00 p.m.', 'error');
            return;
        }

        // Formatear fecha para mostrar
        const fecha_formateada = fecha_ingresada.toLocaleString();

        // Guardar cita en array
        if (id_cita_editando) {
                const cita = lista_citas.find(c => c.id === id_cita_editando);
    if (cita) {
        cita.nombre_mascota = nombre_mascota;
        cita.propietario = propietario;
        cita.telefono = telefono;
        cita.fecha_cita_input = fecha_cita;
        cita.fecha_formateada = fecha_formateada;
        cita.tipo_mascota = tipo_mascota;
        cita.sintomas = sintomas;
        cita.foto = fotos_animales[tipo_mascota] || '';
    }
    id_cita_editando = null;
} else {
    // Nueva cita
    lista_citas.push({
        id: contador_citas++,
        nombre_mascota,
        propietario,
        telefono,
        fecha_cita_input: fecha_cita,
        fecha_formateada,
        tipo_mascota,
        sintomas,
        estado: "Abierta",
        foto: fotos_animales[tipo_mascota]
            });
        }

        formulario.reset();
        cerrar_modal_formulario();
        mostrar_alerta('¡Éxito!', 'Cita agendada correctamente.', 'exito');
        renderizar_tarjetas_citas(lista_citas);
    }

    // Renderizar cards de citas
    function renderizar_tarjetas_citas(citas_para_mostrar) {
    const contenedor = document.getElementById('cardsCitas');
    contenedor.innerHTML = '';
    citas_para_mostrar.forEach(cita => {
        const card = document.createElement('div');
        card.className = 'card-cita';
        card.setAttribute('data-id', cita.id);

        card.innerHTML = `
            <img class="foto-mascota" src="${cita.foto || ''}" alt="Mascota">
            <div class="info">
                <div class="nombre-mascota">${cita.nombre_mascota}</div>
                <div class="detalle">Propietario: ${cita.propietario}</div>
                <div class="detalle">Tel: ${cita.telefono}</div>
                <div class="detalle">Fecha: ${cita.fecha_formateada}</div>
                <div class="detalle">Síntomas: ${cita.sintomas}</div>
                <div class="detalle">
                    Estado:
                    <select class="estado-cita">
                        <option value="Abierta" ${cita.estado === 'Abierta' ? 'selected' : ''}>Abierta</option>
                        <option value="Terminada" ${cita.estado === 'Terminada' ? 'selected' : ''}>Terminada</option>
                        <option value="Anulada" ${cita.estado === 'Anulada' ? 'selected' : ''}>Anulada</option>
                    </select>
                </div>
                <div class="acciones-card">
                    <button class="editar-cita">✏️</button>
                    <button class="eliminar-cita">🗑️</button>
                </div>
            </div>
        `;
        contenedor.appendChild(card);
        });
        // Eventos para editar/eliminar/estado
    contenedor.querySelectorAll('.editar-cita').forEach(btn => {
        btn.onclick = function () {
            const id = parseInt(btn.closest('.card-cita').getAttribute('data-id'));
            abrir_modal_editar_cita(id);
        };
    });
    contenedor.querySelectorAll('.eliminar-cita').forEach(btn => {
        btn.onclick = function () {
            const id = parseInt(btn.closest('.card-cita').getAttribute('data-id'));
            abrir_modal_eliminar_cita(id);
        };
    });
    contenedor.querySelectorAll('.estado-cita').forEach(sel => {
        sel.onchange = function () {
            const id = parseInt(sel.closest('.card-cita').getAttribute('data-id'));
            cambiar_estado_cita(id, sel.value);
        };
});
}

// --- MODIFICADO: Crear card de cita (ahora solo agrega al array y renderiza) ---
function crear_tarjeta_cita(objeto_cita) {
    // Ya no se usa, ahora todo se maneja en el array y renderizado
}

    // Tipos de alertas
    const tipos_alertas = {
        exito: {
            clase: 'alerta-exito',
            titulo: '¡Éxito! Cita Agendada'
        },
        error: {
            clase: 'alerta-error',
            titulo: 'Error'
        },
        informacion: {
            clase: 'alerta-informacion',
            titulo: 'Información importante'
        },
        advertencia: {
            clase: 'alerta-advertencia',
            titulo: 'Advertencia'
        }
    };

    // Mostrar alerta en el modal
    function mostrar_alerta(titulo, mensaje, tipo = 'exito') {
        const modal = document.getElementById('modalCitaInfo');
        const info_cita = document.getElementById('infoCita');

        // Configuro el contenido
        info_cita.innerHTML = `
            <h2>${titulo || tipos_alertas[tipo].titulo}</h2>
            <p>${mensaje}</p>
            <button class="cerrar">Cerrar</button>
        `;

        info_cita.className = tipos_alertas[tipo].clase;

        // Agrego botón de cerrar
        const cerrar_btn = info_cita.querySelector('.cerrar');
        cerrar_btn.addEventListener('click', cerrar_modal_alerta);

        // Muestro con animación
        modal.classList.add('activo');
        modal.style.animation = 'modalEntrada 0.4s ease-in-out';

        // Eliminar animación al final
        setTimeout(() => {
            modal.style.animation = '';
        }, 400);

    }

    // Función principal para inicializar todo
    function inicializar_aplicacion() {
        // Mostrar el modal al hacer clic en "Agregar Cita"
        document.getElementById('agregarCita').addEventListener("click", abrir_modal_agendar_cita);
    
        // Cerrar solo el modal del formulario al hacer clic en su botón "cerrar"
        document.querySelector('#modalAgendarCita .cerrar').addEventListener('click', cerrar_modal_formulario);
    
        // Cerrar solo el modal de alerta al hacer clic en su botón "cerrar"
        document.querySelector('#modalCitaInfo .cerrar').addEventListener('click', cerrar_modal_alerta);

        // Manejo del formulario de citas
        const formularioCita = document.querySelector('#modalAgendarCita .formulario');
        if (formularioCita) {
            formularioCita.addEventListener('submit', manejar_formulario_cita);
        }

        // Actualizar foto del animal en el formulario al cambiar tipo de mascota
        const select_tipo_mascota = document.getElementById('tipoMascotaSelect');
        if (select_tipo_mascota) {
            actualizar_foto_animal(); // Llamada inicial por si hay un valor por defecto
            select_tipo_mascota.addEventListener('change', actualizar_foto_animal);
        }

        // Lógica para el modal de búsqueda de citas
        const inputBusqueda = document.getElementById('inputBusqueda');
        const radioBuscarPorMascota = document.getElementById('buscarPorMascota');
        const radioBuscarPorPropietario = document.getElementById('buscarPorPropietario');

        function filtrar_y_renderizar() {
            if (!inputBusqueda || !radioBuscarPorMascota || !radioBuscarPorPropietario) return;

            const termino = inputBusqueda.value.trim().toLowerCase();
            const tipoBusqueda = radioBuscarPorMascota.checked ? 'mascota' : 'propietario';

            if (!termino) {
                renderizar_tarjetas_citas(lista_citas); // Mostrar todas si no hay término
                return;
            }

            const citasFiltradas = lista_citas.filter(cita => {
                if (tipoBusqueda === 'mascota') {
                    return cita.nombre_mascota.toLowerCase().startsWith(termino);
                } else { // propietario
                    return cita.propietario.toLowerCase().startsWith(termino);
                }
            });
            renderizar_tarjetas_citas(citasFiltradas);
        }

        if (inputBusqueda) {
            inputBusqueda.addEventListener('input', filtrar_y_renderizar);
        }
        if (radioBuscarPorMascota) {
            radioBuscarPorMascota.addEventListener('change', filtrar_y_renderizar);
        }
        if (radioBuscarPorPropietario) {
            radioBuscarPorPropietario.addEventListener('change', filtrar_y_renderizar);
        }

        // Renderizar todas las citas al inicio
        renderizar_tarjetas_citas(lista_citas);
    }

    function actualizar_foto_animal() {
        const select = document.getElementById('tipoMascotaSelect');
        const foto = document.getElementById('fotoAnimalFormulario');
        if (!select || !foto) return;

        const tipo_seleccionado = select.value;
        const url_foto = fotos_animales[tipo_seleccionado] || ''; // Usa el mapeo 'fotos_animales'

        foto.src = url_foto;
        foto.style.display = url_foto ? 'block' : 'none';
        foto.alt = tipo_seleccionado || '';
    }

    // Llama a la función de inicialización aquí
    inicializar_aplicacion();

});