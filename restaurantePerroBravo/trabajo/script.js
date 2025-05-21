/* https://img.freepik.com/vector-premium/dibujos-animados-mesa_119631-412.jpg */
        let datosMesa = [];
        let modo = 0;
        let numMesa = "";
        let mesaAEliminar = null;

        // Mostrar formulario modal
        document.getElementById("abrir").addEventListener("click", function () {
            document.getElementById("modal").style.display = "flex";
        });

        // Guardar o editar mesa
        document.getElementById("registrar").addEventListener("click", () => {
            if (modo == 0) {
                guardarMesa();
            } else if (modo == 1) {
                editarMesa();
            }
        });

        // Buscar mesa por número
        document.getElementById("buscarMesa").addEventListener("input", (e) => {
            let textoBusqueda = e.target.value.trim();
            if (textoBusqueda === "") {
                pintarMesas();
                return;
            }
            let mesasFiltradas = datosMesa.filter(mesa => mesa.numero.startsWith(textoBusqueda));
            pintarMesasFiltradas(mesasFiltradas);
        });

        // Función para pintar mesas filtradas
        function pintarMesasFiltradas(mesas) {
            document.getElementById("mesas").textContent = "";
            mesas.forEach((item, i) => {
                crearCardMesa(item);
            });
        }

        // Función para pintar todas las mesas
        function pintarMesas() {
            document.getElementById("mesas").textContent = "";
            datosMesa.forEach((item, i) => {
                crearCardMesa(item);
            });
        }

        // Crear una card de mesa
        function crearCardMesa(item) {
            let divCard = document.createElement("div");
            divCard.className = "divCard";
            let divImagen = document.createElement("div");
            let imagen = document.createElement("img");
            imagen.className = "mesa";
            imagen.src = "https://img.freepik.com/vector-premium/dibujos-animados-mesa_119631-412.jpg";
            divImagen.appendChild(imagen);
            divCard.appendChild(divImagen);

            let divTextos = document.createElement("div");
            let texto = document.createElement("p");
            texto.textContent = "Mesa N°: " + item.numero;
            let textoCapacidad = document.createElement("p");
            textoCapacidad.textContent = "Capacidad: " + item.personas;
            let textoDescripcion = document.createElement("p");
            textoDescripcion.textContent = "Descripcion: " + item.descripcion;
            let textoEstado = document.createElement("p");
            textoEstado.textContent = "Estado: " + item.estado;
            divTextos.appendChild(texto);
            divTextos.appendChild(textoCapacidad);
            divTextos.appendChild(textoDescripcion);
            divTextos.appendChild(textoEstado);
            divCard.appendChild(divTextos);

            let divBotones = document.createElement("div");
            let editar = document.createElement("button");
            editar.textContent = "📝";
            colorMesa(divCard, item);
            editar.addEventListener("click", () => {
                document.getElementById("nro").value = item.numero;
                document.getElementById("descripcion").value = item.descripcion;
                document.getElementById("personas").value = item.personas;
                document.getElementById("estado").value = item.estado;
                document.getElementById("registrar").textContent = "Editar Mesa";
                modo = 1;
                numMesa = item.numero;
                document.getElementById("modal").style.display = "flex";
            });
            let eliminar = document.createElement("button");
            eliminar.textContent = "❌";
            eliminar.addEventListener("click", () => {
                mesaAEliminar = item.numero;
                document.getElementById("botonConfirmar").style.display = "flex";
            });

            divBotones.appendChild(editar);
            divBotones.appendChild(eliminar);
            divCard.appendChild(divBotones);

            document.getElementById("mesas").appendChild(divCard);
        }

        // Validar datos de la mesa
        function validarMesa(nro, descripcion, personas, estado, numeroOriginal = null) {
            if (nro == "") {
                mostrarAlerta("Por favor digite el numero de mesa");
                return false;
            }
            if (descripcion == "") {
                mostrarAlerta("Por favor digite la descripcion");
                return false;
            }
            if (personas == "") {
                mostrarAlerta("Por favor digite el numero de personas");
                return false;
            }
            if (estado == "") {
                mostrarAlerta("Por favor digite el estado de la mesa");
                return false;
            }
            if (datosMesa.some(mesa => mesa.numero == nro && mesa.numero != numeroOriginal)) {
                mostrarAlerta("Ese numero de mesa ya existe");
                return false;
            }
            return true;
        }

        // Mostrar alerta
        function mostrarAlerta(mensaje) {
            const alerta = document.getElementById("alerta");
            alerta.textContent = mensaje;
            alerta.style.display = "block";
            setTimeout(() => {
                alerta.style.display = "none";
            }, 3000);
        }

        // Colorear la card según estado
        function colorMesa(divCard, item) {
            if (item.estado == "disponible") {
                divCard.style.backgroundColor = "white";
            } else if (item.estado == "ocupado") {
                divCard.style.backgroundColor = "red";
            } else if (item.estado == "reservado") {
                divCard.style.backgroundColor = "orange";
            } else {
                divCard.style.backgroundColor = "white";
            }
        }

        // Guardar mesa
        function guardarMesa() {
            const nro = document.getElementById("nro").value;
            const descripcion = document.getElementById("descripcion").value;
            const personas = document.getElementById("personas").value;
            const estado = document.getElementById("estado").value;

            if (!validarMesa(nro, descripcion, personas, estado)) return;

            let mesa = { numero: nro, descripcion, personas, estado };
            datosMesa.unshift(mesa);
            mostrarAlerta("✅ Registro Exitoso ");
            limpiar();
            pintarMesas();
            document.getElementById("modal").style.display = "none";
        }

        // Limpiar formulario
        function limpiar() {
            document.getElementById("nro").value = "";
            document.getElementById("descripcion").value = "";
            document.getElementById("personas").value = "";
            document.getElementById("estado").value = "";
        }

        // Editar mesa
        function editarMesa() {
            const nro = document.getElementById("nro").value;
            const descripcion = document.getElementById("descripcion").value;
            const personas = document.getElementById("personas").value;
            const estado = document.getElementById("estado").value;

            if (!validarMesa(nro, descripcion, personas, estado, numMesa)) return;

            let indice = datosMesa.findIndex(it => it.numero == numMesa);
            if (indice !== -1) {
                datosMesa[indice].numero = nro;
                datosMesa[indice].descripcion = descripcion;
                datosMesa[indice].personas = personas;
                datosMesa[indice].estado = estado;
                pintarMesas();
                modo = 0;
                document.getElementById("registrar").textContent = "Guardar Mesa";
                limpiar();
                document.getElementById("modal").style.display = "none";
            }
        }

        // Confirmar eliminación
        document.getElementById("confirmar").onclick = function () {
            if (mesaAEliminar !== null) {
                let indice = datosMesa.findIndex(it => it.numero == mesaAEliminar);
                if (indice !== -1) {
                    datosMesa.splice(indice, 1);
                    pintarMesas();
                }
                mesaAEliminar = null;
            }
            document.getElementById("botonConfirmar").style.display = "none";
        };

        document.getElementById("cancelar").onclick = function () {
            mesaAEliminar = null;
            document.getElementById("botonConfirmar").style.display = "none";
        };

