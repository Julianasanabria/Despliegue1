<template>
  <div class="app">
    <h1>🎯Juego del ahorcado</h1>

    <div v-if="juego_iniciado">
      <h2>selecciona el nivel de dificultad</h2>
      <button @click="iniciarJuego('facil')">Fácil</button>
      <button @click="iniciarJuego('medio')">Medio</button>
      <button @click="iniciarJuego('dificil')">Difícil</button>
    </div>
    <div class="palabra">
      <span v-for="(letra, i) in palabra" :key="i">{{ letra }}</span>
    </div>

    

  </div>
</template>

<script setup>
import { ref } from 'vue'
const juego_iniciado = ref(true)
const palabra = ref("")
const categoria_seleccionada= ref ("")

//categorias de animales 
let animales= ["perro", "gato", "elefante", "jirafa", "cerdo", "gallina", "loro", "tortuga", "burro", "dinosaurio"]
let animalesRamdon = animales[Math.floor(Math.random()* animales.length)]
console.log(animalesRamdon);

//categorias de frutas 
let frutas= ["manzana", "durazno", "mango", "piña", "lulo", "sandia", "banano", "mandarina", "naranja", "fresa", "guayaba"]
let frutasRamdon = frutas[Math.floor(Math.random()* frutas.length)]
console.log(frutasRamdon);

//categorias de paises 
let paises= ["colombia", "venezuela", "argentina", "chile", "iran", "peru", "ecuador", "israel", "bolivia", "españa"]
let paisesRamdon = paises[Math.floor(Math.random()* paises.length)]
console.log(paisesRamdon);

//categorias de deportes
let deportes=["futbol", "baloncesto", "tenis", "natacion", "voleibol", "tenis", "golf", "atletismo", "beisbol", "ciclismo"]
let deportesRamdon = deportes[Math.floor(Math.random()* deportes.length)]
console.log(deportesRamdon);

//categorias de colores 
let colores=  ["rojo", "azul", "cafe", "morado", "amarillo", "verde", "marron", "gris", "negro", "blanco"]
let coloresRamdon = colores[Math.floor(Math.random()* colores.length)]
console.log(coloresRamdon);

function iniciarJuego(dificultad) {
  juego_iniciado.value = false

}
</script>

<style scoped>

.app {
  text-align: center;
  font-family: Arial, sans-serif;
  background-color: #222;
  padding: 20px;
  height: 200px;
  width: 600px;
  animation: flameBorder 1s infinite alternate;
  position: relative;
  z-index: 1;
  box-shadow:
    0 0 10px rgba(255, 80, 0, 0.5),
    0 0 20px rgba(255, 100, 0, 0.7),
    0 0 30px rgba(255, 140, 0, 0.9);
}

@keyframes flameBorder {
  0% {
    box-shadow:
      0 0 10px rgba(255, 80, 0, 0.5),
      0 0 20px rgba(255, 100, 0, 0.7),
      0 0 30px rgba(255, 140, 0, 0.9);
  }
  100% {
    box-shadow:
      0 0 20px rgba(255, 140, 0, 0.9),
      0 0 30px rgba(255, 100, 0, 0.7),
      0 0 40px rgba(255, 80, 0, 0.5);
  }
}


h1 {
  color:#fff;
}

h2 {
  color: #fff;
}

button {
  margin: 5px;
  padding: 10px  50px;
  font-size: 16px;
  cursor: pointer;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  transition: transform 0.2s ease, box-shadow 0.3s ease;
}

/* Efecto al pasar el mouse */
button:hover {
  transform: scale(1.1);
  box-shadow: 0 0 12px rgba(0, 123, 255, 0.6);
}

/* Efecto al hacer clic (presionar) */
button:active {
  transform: scale(0.95);
  box-shadow: 0 0 4px rgba(0, 123, 255, 0.8);
}

</style>