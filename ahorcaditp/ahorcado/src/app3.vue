<template>
  <div class="app">
    <h1>🎯 Juego del Ahorcado</h1>

    <!-- Selección de dificultad -->
    <div v-if="!juegoIniciado">
      <h2>Selecciona un nivel:</h2>
      <button @click="iniciarJuego('facil')">Fácil</button>
      <button @click="iniciarJuego('medio')">Medio</button>
      <button @click="iniciarJuego('dificil')">Difícil</button>
    </div>

    <!-- Juego activo -->
    <div v-else>
      <!-- Muñeco SVG -->
      <div class="ahorcado">
        <svg width="150" height="200">
          <!-- Soporte -->
          <line x1="10" y1="180" x2="140" y2="180" stroke="black" stroke-width="4" />
          <line x1="40" y1="180" x2="40" y2="20" stroke="black" stroke-width="4" />
          <line x1="40" y1="20" x2="100" y2="20" stroke="black" stroke-width="4" />
          <line x1="100" y1="20" x2="100" y2="40" stroke="black" stroke-width="4" />

          <!-- Muñeco según errores -->
          <circle v-if="errores > 0" cx="100" cy="50" r="10" stroke="black" fill="lightblue" stroke-width="2" />
          <line v-if="errores > 1" x1="100" y1="60" x2="100" y2="100" stroke="black" stroke-width="2" />
          <line v-if="errores > 2" x1="100" y1="70" x2="85" y2="90" stroke="black" stroke-width="2" />
          <line v-if="errores > 3" x1="100" y1="70" x2="115" y2="90" stroke="black" stroke-width="2" />
          <line v-if="errores > 4" x1="100" y1="100" x2="90" y2="130" stroke="black" stroke-width="2" />
          <line v-if="errores > 5" x1="100" y1="100" x2="110" y2="130" stroke="black" stroke-width="2" />
        </svg>
      </div>

      <!-- Palabra oculta -->
      <div class="palabra">
        <span v-for="(letra, i) in palabraMostrada" :key="i" class="letra">
          {{ letra }}
        </span>
      </div>

      <!-- Botones de letras -->
      <div class="letras">
        <button
          v-for="letra in abecedario"
          :key="letra"
          :disabled="letrasUsadas.includes(letra) || juegoTerminado"
          @click="elegirLetra(letra)"
        >
          {{ letra }}
        </button>
      </div>

      <!-- Contadores -->
      <div class="contador">
        <p><strong>Intentos:</strong> {{ maxErrores }}</p>
        <p><strong>Aciertos:</strong> {{ aciertos }}</p>
        <p><strong>Errores:</strong> {{ errores }}</p>
      </div>

      <!-- Resultado -->
      <div v-if="juegoTerminado">
        <h2 v-if="ganaste">¡Ganaste! 🎉</h2>
        <h2 v-else>Perdiste 😢 — La palabra era: {{ palabraSecreta }}</h2>
        <button @click="reiniciarJuego">Reiniciar</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      niveles: {
        facil: {
          palabras: ['gato', 'sol', 'mar', 'pato'],
          errores: 7
        },
        medio: {
          palabras: ['camion', 'laptop', 'escuela', 'jardin'],
          errores: 6
        },
        dificil: {
          palabras: ['programacion', 'matematicas', 'electricidad', 'escritorio'],
          errores: 5
        }
      },
      nivelSeleccionado: '',
      palabraSecreta: '',
      letrasUsadas: [],
      maxErrores: 0,
      juegoIniciado: false
    };
  },
  computed: {
    palabraMostrada() {
      return this.palabraSecreta
        .split('')
        .map(letra => (this.letrasUsadas.includes(letra) ? letra : '_'));
    },
    errores() {
      return this.letrasUsadas.filter(
        letra => !this.palabraSecreta.includes(letra)
      ).length;
    },
    aciertos() {
      return this.letrasUsadas.filter(
        letra => this.palabraSecreta.includes(letra)
      ).length;
    },
    juegoTerminado() {
      return this.ganaste || this.errores >= this.maxErrores;
    },
    ganaste() {
      return this.palabraMostrada.join('') === this.palabraSecreta;
    },
    abecedario() {
      return 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ'.split('');
    }
  },
  methods: {
    iniciarJuego(nivel) {
      this.nivelSeleccionado = nivel;
      const palabras = this.niveles[nivel].palabras;
      this.palabraSecreta = palabras[Math.floor(Math.random() * palabras.length)].toUpperCase();
      this.maxErrores = this.niveles[nivel].errores;
      this.letrasUsadas = [];
      this.juegoIniciado = true;
    },
    elegirLetra(letra) {
      if (!this.letrasUsadas.includes(letra) && !this.juegoTerminado) {
        this.letrasUsadas.push(letra);
      }
    },
    reiniciarJuego() {
      this.juegoIniciado = false;
      this.nivelSeleccionado = '';
      this.palabraSecreta = '';
      this.letrasUsadas = [];
      this.maxErrores = 0;
    }
  }
};
</script>

<style scoped>
.app {
  max-width: 700px;
  margin: 0 auto;
  text-align: center;
  font-family: sans-serif;
  padding: 20px;
}

.ahorcado {
  margin: 20px 0;
}

.palabra {
  margin: 20px 0;
  font-size: 28px;
}

.letra {
  display: inline-block;
  margin: 0 5px;
  padding: 5px 10px;
  border-bottom: 2px solid #000;
  min-width: 20px;
}

.letras {
  margin: 10px 0;
}

.letras button {
  margin: 4px;
  padding: 8px 12px;
  font-size: 16px;
  text-transform: uppercase;
  cursor: pointer;
}

.letras button:disabled {
  background-color: #ddd;
  color: #777;
  cursor: not-allowed;
}

.contador p {
  font-size: 18px;
  margin: 4px;
}
</style>
