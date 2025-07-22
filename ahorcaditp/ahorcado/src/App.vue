<template>
  <div class="snake"></div>
  <div class="app">
    <div class="titulo-fuego">
      <h3>🎯Juego del ahorcado</h3>
    </div>

    <!-- Pantalla 1: Dificultad -->
    <div v-if="pantallaActual === 'dificultad'" class="pantalla">
      <div v-if="records.length" class="tabla-records">
        <h2>🏆 Tabla de Récords</h2>
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Palabra</th>
              <th>Categoría</th>
              <th>Dificultad</th>
              <th>Resultado</th>
              <th>Tiempo</th>
              <th>Fecha</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(rec, i) in records" :key="i">
              <td>{{ rec.nombre }}</td>
              <td>{{ rec.palabra.toUpperCase() }}</td>
              <td>{{ rec.categoria }}</td>
              <td>{{ rec.dificultad }}</td>
              <td :style="{color: rec.resultado === 'ganado' ? '#00ffcc' : '#ff3300'}">
                {{ rec.resultado === 'ganado' ? 'Ganó' : 'Perdió' }}
              </td>
              <td>{{ rec.tiempoRestante }}s</td>
              <td>{{ rec.fecha }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <form @submit.prevent="guardarNombreJugador()" class="form-nombre-jugador">
        <label for="nombreJugador">Nombre del jugador:</label>
        <input id="nombreJugador" v-model="nombreJugador" maxlength="20" placeholder="Escribe tu nombre" required />
      </form>
      <img src="https://i.pinimg.com/236x/3b/41/11/3b411174a527e7f4a8cd49a604bed471.jpg" 
           alt="Ahorcado" 
           class="imagen-ahorcado" />
      <div class="sub-titulo">
        <h2>Selecciona el nivel de dificultad</h2>
      </div>
      <button :disabled="!nombreJugador" @click="seleccionarDificultad('facil')">Fácil</button>
      <button :disabled="!nombreJugador" @click="seleccionarDificultad('medio')">Medio</button>
      <button :disabled="!nombreJugador" @click="seleccionarDificultad('dificil')">Difícil</button>
    </div>
    
    <!-- Pantalla 2: Categorías -->
    <div v-else-if="pantallaActual === 'categorias'" class="pantalla">
      <img src="https://i.pinimg.com/236x/3b/41/11/3b411174a527e7f4a8cd49a604bed471.jpg" 
           alt="Ahorcado" 
           class="imagen-ahorcado" />
      <div class="sub-titulo">
        <h2>Seleccione la Categoría (Dificultad: {{ dificultadSeleccionada }})</h2>
      </div>
      <button @click="seleccionarCategoria('animales')">Animales</button>
      <button @click="seleccionarCategoria('frutas')">Frutas</button>
      <button @click="seleccionarCategoria('deportes')">Deportes</button>
      <button @click="seleccionarCategoria('paises')">Países</button>
      <button @click="seleccionarCategoria('colores')">Colores</button>
    </div>
    
    <!-- Pantalla 3: Juego Principal -->
    <div v-else-if="pantallaActual === 'juego'" class="pantalla-juego">
      <div class="temporizador">
        ⏰ Tiempo restante: <span :class="{'tiempo-critico': tiempoRestante <= 10}">{{ tiempoRestante }}s</span>
      </div>
      <img src="https://i.pinimg.com/236x/3b/41/11/3b411174a527e7f4a8cd49a604bed471.jpg" 
           alt="Ahorcado" 
           class="imagen-ahorcado" />
      
      <h2>Categoría: {{ categoria_seleccionada }} ({{ dificultadSeleccionada }})</h2>
      
      <div class="juego-contenido">
        <div class="ahorcado-dibujo">
          <!-- Mostrar imagen local de Mario según los intentos restantes -->
          <img v-if="imagenesAhorcado[intentosRestantes]" :src="imagenesAhorcado[intentosRestantes]" alt="Ahorcado Mario" class="mario-img" />
        </div>

        <div class="intentos">
          Intentos restantes: {{ intentosRestantes }}
        </div>

        <div class="palabra-oculta">
          <span v-for="(letra, i) in palabraOculta" :key="i" class="letra">
            {{ letra }}
          </span>
        </div>
        
        <div class="teclado">
          <button 
            v-for="letra in 'abcdefghijklmnñopqrstuvwxyz'.split('')" 
            :key="letra"
            @click="adivinarLetra(letra)"
            :disabled="letrasUsadas.includes(letra)"
            :class="{
              'correcta': letrasUsadas.includes(letra) && palabra.includes(letra),
              'incorrecta': letrasUsadas.includes(letra) && !palabra.includes(letra)
            }"
          >
            {{ letra }}
          </button>
        </div>
      </div>
    </div>
    
    <!-- Pantalla 4: Resultados -->
    <div v-else class="pantalla-resultado">
      <div class="contenido-resultado">
        <img src="https://i.pinimg.com/236x/3b/41/11/3b411174a527e7f4a8cd49a604bed471.jpg" 
             alt="Ahorcado" 
             class="imagen-ahorcado" />
             
        <h2 v-if="resultadoJuego === 'ganado'" class="resultado-ganador">¡Ganaste! 🎉</h2>
        <h2 v-else class="resultado-perdedor">¡Perdiste! 😢</h2>
        
        <div class="info-resultado">
          <p><strong>Categoría:</strong> {{ categoria_seleccionada }}</p>
          <p><strong>Dificultad:</strong> {{ dificultadSeleccionada }}</p>
          <p><strong>Palabra:</strong> {{ palabra.toUpperCase() }}</p>
          <p><strong>Intentos restantes:</strong> {{ intentosRestantes }}</p>
        </div>
        
        <button @click="reiniciarJuego()" class="boton-reiniciar">Jugar de nuevo</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
// Importar imágenes locales de Mario
import marioCabeza from './assets/cabeza.png'
import marioCabezaUnBrazo from './assets/cabezayunbrazo.png'
import marioCabezaDosBrazos from './assets/Cabezaydosbrazos.png'
import marioTorsoCabezaDosBrazos from './assets/torso_cabeza_dosbrazos.png'
import marioCabezaTorsoBrazosUnaPierna from './assets/cabeza_torso_brazos_una_pierna.png'
import marioCuerpoCompleto from './assets/Cuerpo_completo.png'

// Estados del juego
const pantallaActual = ref('dificultad')
const dificultadSeleccionada = ref('')
const palabra = ref('')
const categoria_seleccionada = ref('')
const intentosRestantes = ref(6)
const letrasUsadas = ref([])
const resultadoJuego = ref('')

// Nombre del jugador
const nombreJugador = ref('')

function cargarNombreJugador() {
  const n = localStorage.getItem('ahorcado_nombre')
  if (n) nombreJugador.value = n
}
function guardarNombreJugador() {
  localStorage.setItem('ahorcado_nombre', nombreJugador.value)
}

// Temporizador
const tiempoRestante = ref(0)
let timerInterval = null

// Tabla de récords
const records = ref([])

function cargarRecords() {
  const data = localStorage.getItem('ahorcado_records')
  records.value = data ? JSON.parse(data) : []
}

function guardarRecord() {
  const nuevoRecord = {
    nombre: nombreJugador.value,
    palabra: palabra.value,
    categoria: categoria_seleccionada.value,
    dificultad: dificultadSeleccionada.value,
    resultado: resultadoJuego.value,
    tiempoRestante: tiempoRestante.value,
    letrasUsadas: [...letrasUsadas.value],
    fecha: new Date().toLocaleString()
  }
  const data = localStorage.getItem('ahorcado_records')
  let arr = data ? JSON.parse(data) : []
  arr.unshift(nuevoRecord)
  arr = arr.slice(0, 10) // Solo los 10 más recientes
  localStorage.setItem('ahorcado_records', JSON.stringify(arr))
  records.value = arr
}

onMounted(() => {
  cargarRecords()
  cargarNombreJugador()
})

watch(resultadoJuego, (nuevo) => {
  if (nuevo === 'ganado' || nuevo === 'perdido') {
    guardarRecord()
  }
})

function tiempoPorDificultad() {
  if (dificultadSeleccionada.value === 'facil') return 90
  if (dificultadSeleccionada.value === 'medio') return 60
  if (dificultadSeleccionada.value === 'dificil') return 30
  return 60
}

function iniciarTemporizador() {
  tiempoRestante.value = tiempoPorDificultad()
  if (timerInterval) clearInterval(timerInterval)
  timerInterval = setInterval(() => {
    if (pantallaActual.value !== 'juego') {
      clearInterval(timerInterval)
      return
    }
    if (tiempoRestante.value > 0) {
      tiempoRestante.value--
    } else {
      resultadoJuego.value = 'perdido'
      pantallaActual.value = 'resultado'
      clearInterval(timerInterval)
    }
  }, 1000)
}

watch([pantallaActual, dificultadSeleccionada], ([pant, dif], [oldPant, oldDif]) => {
  if (pant === 'juego') {
    iniciarTemporizador()
  } else {
    clearInterval(timerInterval)
  }
})

onUnmounted(() => {
  clearInterval(timerInterval)
})

// Palabras por categoría y dificultad
const palabrasPorCategoria = {
  animales: {
    facil: ['gato', 'perro', 'oso', 'pato', 'rata'],
    medio: ['elefante', 'jirafa', 'leon', 'tigre', 'cebra'],
    dificil: ['ornitorrinco', 'armadillo', 'canguro', 'murcielago', 'hipopotamo']
  },
  frutas: {
    facil: ['uva', 'pera', 'mango', 'kiwi', 'melon'],
    medio: ['banana', 'ciruela', 'sandia', 'melon', 'papaya'],
    dificil: ['maracuya', 'guanabana', 'pitahaya', 'rambutan', 'lichi']
  },
  deportes: {
    facil: ['futbol', 'golf', 'boxeo', 'surf', 'judo'],
    medio: ['baloncesto', 'voleibol', 'natacion', 'atletismo', 'ciclismo'],
    dificil: ['esgrima', 'badminton', 'waterpolo', 'parapente', 'pentatlon']
  },
  paises: {
    facil: ['peru', 'china', 'chile', 'italia', 'cuba'],
    medio: ['argentina', 'colombia', 'venezuela', 'ecuador', 'uruguay'],
    dificil: ['kirguistan', 'mozambique', 'tayikistan', 'azerbaijan', 'bosnia']
  },
  colores: {
    facil: ['rojo', 'azul', 'verde', 'gris', 'rosa'],
    medio: ['amarillo', 'naranja', 'morado', 'blanco', 'negro'],
    dificil: ['turquesa', 'magenta', 'esmeralda', 'bermellon', 'amaranto']
  }
}

// Palabra oculta con guiones bajos
const palabraOculta = computed(() => {
  return palabra.value.split('').map(letra => {
    return letrasUsadas.value.includes(letra) ? letra : '_'
  }).join(' ')
})

// Mapeo de imágenes según intentos restantes
const imagenesAhorcado = [
  marioCuerpoCompleto, // 0 intentos: cuerpo completo
  marioCabezaTorsoBrazosUnaPierna, // 1 intento: cabeza, torso, brazos y una pierna
  marioTorsoCabezaDosBrazos, // 2 intentos: cabeza, dos brazos y torso
  marioCabezaDosBrazos, // 3 intentos: cabeza y dos brazos
  marioCabezaUnBrazo, // 4 intentos: cabeza y un brazo
  marioCabeza, // 5 intentos: cabeza
  null // 6 intentos: nada
];

// Seleccionar dificultad
function seleccionarDificultad(dificultad) {
  dificultadSeleccionada.value = dificultad
  pantallaActual.value = 'categorias'
}

// Seleccionar categoría
function seleccionarCategoria(categoria) {
  categoria_seleccionada.value = categoria
  pantallaActual.value = 'juego'
  
  // Seleccionar palabra aleatoria
  const palabras = palabrasPorCategoria[categoria][dificultadSeleccionada.value]
  palabra.value = palabras[Math.floor(Math.random() * palabras.length)].toLowerCase()
  
  // Reiniciar estado del juego
  letrasUsadas.value = []
  intentosRestantes.value = 6
  resultadoJuego.value = ''
}

// Adivinar letra
function adivinarLetra(letra) {
  if (letrasUsadas.value.includes(letra)) return
  
  letrasUsadas.value.push(letra)
  
  if (!palabra.value.includes(letra)) {
    intentosRestantes.value--
  }
  
  verificarEstadoJuego()
}

// Verificar estado del juego
function verificarEstadoJuego() {
  if (intentosRestantes.value === 0) {
    resultadoJuego.value = 'perdido'
    pantallaActual.value = 'resultado'
  } else if (!palabraOculta.value.includes('_')) {
    resultadoJuego.value = 'ganado'
    pantallaActual.value = 'resultado'
  }
}

// Reiniciar juego
function reiniciarJuego() {
  pantallaActual.value = 'dificultad'
  dificultadSeleccionada.value = ''
  categoria_seleccionada.value = ''
  palabra.value = ''
  letrasUsadas.value = []
  intentosRestantes.value = 6
  resultadoJuego.value = ''
}
</script>

<style scoped>
/* ESTILOS CAÓTICOS Y LLAMATIVOS */
.app {
  text-align: center;
  font-family: 'Comic Sans MS', cursive, sans-serif;
  background: linear-gradient(135deg, #ff00cc, #3333ff, #00ffcc, #ffcc00, #ff3300);
  background-size: 400% 400%;
  animation: fondoLocura 5s ease-in-out infinite;
  padding: 20px;
  min-height: 550px;
  width: 900px;
  margin: 0 auto;
  border-radius: 40px;
  box-shadow: 0 0 40px 10px #ff00cc, 0 0 80px 20px #00ffcc;
  position: relative;
  overflow: hidden;
  border: 8px dashed #ffcc00;
}

@keyframes fondoLocura {
  0% {background-position: 0% 50%;}
  50% {background-position: 100% 50%;}
  100% {background-position: 0% 50%;}
}

.titulo-fuego h3 {
  font-family: 'Nosifer', cursive;
  font-size: 40px;
  color: #fff200;
  text-shadow: 0 0 10px #ff00cc, 0 0 20px #00ffcc, 0 0 30px #ff3300;
  margin-bottom: 30px;
  letter-spacing: 5px;
  animation: titilar 1s infinite alternate;
}

@keyframes titilar {
  0% { color: #fff200; }
  100% { color: #ff00cc; }
}

button {
  font-family: 'Bangers', cursive;
  padding: 16px 40px;
  margin: 12px;
  background: linear-gradient(90deg, #ff00cc, #00ffcc, #ffcc00, #ff3300);
  background-size: 200% 200%;
  animation: btnLocura 2s linear infinite;
  border: 4px solid #fff200;
  border-radius: 20px;
  color: #fff;
  font-size: 2rem;
  box-shadow: 0 0 20px #ff00cc, 0 0 10px #00ffcc;
  transition: all 0.2s;
  cursor: pointer;
  text-transform: uppercase;
}

@keyframes btnLocura {
  0% {background-position: 0% 50%;}
  50% {background-position: 100% 50%;}
  100% {background-position: 0% 50%;}
}

button:hover {
  transform: scale(1.2) rotate(-5deg);
  box-shadow: 0 0 40px #ff3300, 0 0 20px #00ffcc;
  border-color: #ff00cc;
}

button:disabled {
  opacity: 0.5;
  filter: grayscale(1) blur(1px);
}

.mario-img {
  width: 220px;
  height: 220px;
  object-fit: contain;
  border-radius: 50%;
  border: 6px solid #ff00cc;
  box-shadow: 0 0 30px #00ffcc, 0 0 10px #ffcc00;
  background: #fff200;
  animation: saltarMario 1.2s infinite alternate;
}

@keyframes saltarMario {
  0% { transform: translateY(0) scale(1); }
  100% { transform: translateY(-20px) scale(1.1) rotate(-5deg); }
}

.palabra-oculta {
  font-size: 2.5rem;
  letter-spacing: 1.5rem;
  margin: 2.5rem 0;
  color: #fff200;
  min-height: 60px;
  text-shadow: 0 0 10px #ff00cc, 0 0 20px #00ffcc;
  background: linear-gradient(90deg, #ff00cc44, #00ffcc44);
  border-radius: 10px;
  padding: 10px 0;
}

.letra {
  display: inline-block;
  min-width: 40px;
  text-align: center;
  font-weight: bold;
  color: #ff3300;
  text-shadow: 0 0 10px #fff200, 0 0 5px #00ffcc;
  font-size: 2.2rem;
}

.teclado {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px;
  max-width: 600px;
  margin: 30px auto;
  padding: 20px;
  background: linear-gradient(135deg, #ff00cc99, #00ffcc99);
  border-radius: 20px;
  box-shadow: 0 0 20px #ff00cc, 0 0 10px #00ffcc;
}

.teclado button {
  padding: 10px 14px;
  margin: 0;
  font-size: 1.3rem;
  width: 45px;
  height: 45px;
  border-radius: 50%;
  border: 3px solid #ffcc00;
  background: linear-gradient(90deg, #ff3300, #ffcc00);
  color: #fff;
  box-shadow: 0 0 10px #ff00cc;
  font-weight: bold;
  transition: 0.2s;
}

.teclado button.correcta {
  background: #00ffcc !important;
  color: #222 !important;
  border-color: #fff200 !important;
  box-shadow: 0 0 20px #00ffcc;
}

.teclado button.incorrecta {
  background: #ff3300 !important;
  color: #fff200 !important;
  border-color: #ff00cc !important;
  box-shadow: 0 0 20px #ff00cc;
  opacity: 0.7;
}

.intentos {
  color: #fff200;
  font-size: 2rem;
  margin: 20px 0;
  font-weight: bold;
  text-shadow: 0 0 10px #ff00cc, 0 0 5px #00ffcc;
  background: #ff330044;
  border-radius: 10px;
  padding: 10px 0;
}

.pantalla-resultado {
  /* Quitar position: fixed, top, left, width, height, z-index, y background animado */
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 40px;
  background: none;
  animation: none;
}

@keyframes resultadoLocura {
  0% { filter: hue-rotate(0deg); }
  100% { filter: hue-rotate(90deg); }
}

.contenido-resultado {
  background: #222;
  padding: 50px;
  border-radius: 30px;
  text-align: center;
  max-width: 600px;
  width: 95%;
  box-shadow: 0 0 40px #ff00cc, 0 0 20px #00ffcc;
  border: 6px solid #fff200;
}

.info-resultado {
  background: #ffcc0044;
  padding: 25px;
  border-radius: 15px;
  margin: 25px 0;
  text-align: left;
  color: #ff3300;
  font-size: 1.3rem;
  font-weight: bold;
  box-shadow: 0 0 10px #ff00cc;
}

.info-resultado p {
  margin: 12px 0;
  color: #ff3300;
  font-size: 1.2rem;
}

.resultado-ganador {
  color: #00ffcc;
  font-size: 3rem;
  text-shadow: 0 0 20px #fff200, 0 0 10px #ff00cc;
  animation: titilar 1s infinite alternate;
}

.resultado-perdedor {
  color: #ff3300;
  font-size: 3rem;
  text-shadow: 0 0 20px #fff200, 0 0 10px #00ffcc;
  animation: titilar 1s infinite alternate;
}

.boton-reiniciar {
  background: linear-gradient(90deg, #00ffcc, #ff00cc);
  font-size: 1.5rem;
  padding: 18px 50px;
  margin-top: 30px;
  border-radius: 20px;
  border: 4px solid #fff200;
  color: #fff;
  box-shadow: 0 0 20px #ff00cc, 0 0 10px #00ffcc;
  animation: btnLocura 2s linear infinite;
}

.snake {
  filter: hue-rotate(120deg) brightness(1.5) saturate(2);
  animation: moveSnake 5s linear infinite, snakeLoca 1s infinite alternate;
}

@keyframes snakeLoca {
  0% { filter: hue-rotate(0deg) brightness(1.5) saturate(2); }
  100% { filter: hue-rotate(180deg) brightness(2) saturate(3); }
}

.ahorcado-dibujo {
  position: relative;
  width: 220px;
  height: 260px;
  margin: 0 auto 20px auto;
}

.poste-ahorcado {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
}
.base {
  position: absolute;
  bottom: 0;
  left: 10px;
  width: 120px;
  height: 18px;
  background: #8d5524;
  border-radius: 8px;
}
.poste {
  position: absolute;
  bottom: 18px;
  left: 40px;
  width: 18px;
  height: 180px;
  background: #8d5524;
  border-radius: 8px;
}
.techo {
  position: absolute;
  top: 0;
  left: 40px;
  width: 90px;
  height: 18px;
  background: #8d5524;
  border-radius: 8px;
}
.cuerda {
  position: absolute;
  top: 18px;
  left: 120px;
  width: 4px;
  height: 40px;
  background: #fff;
  border-radius: 2px;
}

.mario-ahorcado-imgs {
  position: absolute;
  left: 110px;
  top: 58px;
  width: 80px;
  height: 180px;
}
.mario-parte {
  position: absolute;
  width: 60px;
  height: auto;
  left: 10px;
  top: 0;
  pointer-events: none;
  user-select: none;
}
.mario-cabeza {
  z-index: 2;
  width: 44px;
  left: 18px;
  top: 0;
}
.mario-cuerpo {
  z-index: 1;
  width: 48px;
  left: 16px;
  top: 40px;
}
.mario-brazo-izq {
  z-index: 1;
  width: 32px;
  left: -8px;
  top: 54px;
}
.mario-brazo-der {
  z-index: 1;
  width: 32px;
  left: 44px;
  top: 54px;
}
.mario-pierna-izq {
  z-index: 0;
  width: 24px;
  left: 18px;
  top: 92px;
}
.mario-pierna-der {
  z-index: 0;
  width: 24px;
  left: 38px;
  top: 92px;
}
.temporizador {
  font-size: 2rem;
  font-weight: bold;
  color: #fff200;
  background: #ff00cc99;
  border-radius: 12px;
  padding: 10px 30px;
  margin: 0 auto 18px auto;
  width: fit-content;
  box-shadow: 0 0 10px #ff00cc, 0 0 5px #00ffcc;
  letter-spacing: 2px;
}
.tiempo-critico {
  color: #ff3300;
  animation: parpadeo 1s infinite alternate;
}
@keyframes parpadeo {
  0% { opacity: 1; }
  100% { opacity: 0.5; }
}
.tabla-records {
  background: #222;
  border-radius: 18px;
  padding: 18px 24px;
  margin-bottom: 24px;
  box-shadow: 0 0 20px #ff00cc, 0 0 10px #00ffcc;
  color: #fff200;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
}
.tabla-records h2 {
  color: #fff200;
  margin-bottom: 10px;
  text-align: center;
}
.tabla-records table {
  width: 100%;
  border-collapse: collapse;
  background: #333;
  border-radius: 10px;
  overflow: hidden;
}
.tabla-records th, .tabla-records td {
  padding: 8px 10px;
  text-align: center;
  border-bottom: 1px solid #ff00cc44;
}
.tabla-records th {
  background: #ff00cc44;
  color: #fff;
}
.tabla-records tr:last-child td {
  border-bottom: none;
}
.form-nombre-jugador {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 18px;
}
.form-nombre-jugador label {
  color: #fff200;
  font-size: 1.2rem;
  margin-bottom: 6px;
}
.form-nombre-jugador input {
  font-size: 1.2rem;
  padding: 8px 16px;
  border-radius: 8px;
  border: 2px solid #ff00cc;
  outline: none;
  margin-bottom: 6px;
  background: #333;
  color: #fff;
  box-shadow: 0 0 8px #ff00cc44;
}
.form-nombre-jugador input:focus {
  border-color: #fff200;
}
</style>