<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Juego del Ahorcado Completo</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Arial', sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 20px;
        }

        .game-container {
            background: white;
            border-radius: 20px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            padding: 30px;
            max-width: 800px;
            width: 100%;
            text-align: center;
        }

        .game-title {
            font-size: 2.5em;
            color: #4a5568;
            margin-bottom: 30px;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
        }

        .screen {
            display: none;
        }

        .screen.active {
            display: block;
            animation: fadeIn 0.5s ease-in;
        }

        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }

        /* Pantalla de dificultad */
        .difficulty-screen h2 {
            color: #2d3748;
            margin-bottom: 30px;
            font-size: 1.8em;
        }

        .difficulty-buttons {
            display: flex;
            gap: 20px;
            justify-content: center;
            flex-wrap: wrap;
        }

        .btn {
            padding: 15px 30px;
            border: none;
            border-radius: 10px;
            font-size: 1.1em;
            font-weight: bold;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }

        .btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 12px rgba(0,0,0,0.15);
        }

        .btn-easy { background: #48bb78; color: white; }
        .btn-medium { background: #ed8936; color: white; }
        .btn-hard { background: #e53e3e; color: white; }
        .btn-category { background: #667eea; color: white; margin: 10px; }
        .btn-secondary { background: #718096; color: white; }
        .btn-primary { background: #3182ce; color: white; }

        /* Pantalla de categorías */
        .category-screen h2 {
            color: #2d3748;
            margin-bottom: 20px;
            font-size: 1.8em;
        }

        .difficulty-info {
            background: #edf2f7;
            padding: 15px;
            border-radius: 10px;
            margin-bottom: 30px;
            font-size: 1.1em;
            color: #4a5568;
        }

        .category-buttons {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
            margin-bottom: 30px;
        }

        /* Pantalla del juego */
        .game-screen {
            text-align: center;
        }

        .game-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 30px;
            flex-wrap: wrap;
            gap: 15px;
        }

        .category-title {
            font-size: 1.5em;
            color: #2d3748;
            font-weight: bold;
        }

        .game-stats {
            display: flex;
            gap: 20px;
            align-items: center;
        }

        .error-counter {
            background: #fed7d7;
            color: #c53030;
            padding: 10px 20px;
            border-radius: 20px;
            font-weight: bold;
            border: 2px solid #fc8181;
        }

        /* Dibujo del ahorcado */
        .hangman-area {
            background: #f7fafc;
            border-radius: 15px;
            padding: 30px;
            margin: 30px 0;
            position: relative;
        }

        .hangman-drawing {
            width: 200px;
            height: 250px;
            margin: 0 auto;
            position: relative;
            border: 2px dashed #cbd5e0;
            border-radius: 10px;
            background: #ffffff;
        }

        /* SVG para el dibujo del ahorcado */
        .hangman-svg {
            width: 100%;
            height: 100%;
        }

        .hangman-part {
            opacity: 0;
            transition: opacity 0.5s ease;
        }

        .hangman-part.visible {
            opacity: 1;
        }

        /* Palabra a adivinar */
        .word-display {
            margin: 40px 0;
            font-size: 2.5em;
            font-family: 'Courier New', monospace;
            letter-spacing: 10px;
            color: #2d3748;
            font-weight: bold;
        }

        .letter-space {
            display: inline-block;
            width: 50px;
            height: 60px;
            border-bottom: 4px solid #4299e1;
            margin: 0 5px;
            text-align: center;
            line-height: 60px;
            vertical-align: bottom;
        }

        /* Área de input */
        .input-area {
            margin: 40px 0;
        }

        .letter-input {
            width: 80px;
            height: 60px;
            font-size: 2em;
            text-align: center;
            text-transform: uppercase;
            border: 3px solid #4299e1;
            border-radius: 10px;
            margin-right: 15px;
            outline: none;
            font-weight: bold;
        }

        .letter-input:focus {
            border-color: #3182ce;
            box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.1);
        }

        .guess-btn {
            height: 60px;
            padding: 0 25px;
            font-size: 1.2em;
        }

        /* Letras usadas */
        .used-letters {
            margin: 30px 0;
        }

        .used-letters h3 {
            color: #2d3748;
            margin-bottom: 20px;
            font-size: 1.3em;
        }

        .letters-grid {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 10px;
        }

        .letter-badge {
            padding: 8px 12px;
            border-radius: 20px;
            font-weight: bold;
            font-size: 1.1em;
            text-transform: uppercase;
            transition: all 0.3s ease;
        }

        .letter-correct {
            background: #c6f6d5;
            color: #2f855a;
            border: 2px solid #68d391;
        }

        .letter-incorrect {
            background: #fed7d7;
            color: #c53030;
            border: 2px solid #fc8181;
        }

        /* Resultado del juego */
        .game-result {
            margin-top: 30px;
            padding: 30px;
            border-radius: 15px;
            font-size: 1.5em;
            font-weight: bold;
        }

        .result-win {
            background: #c6f6d5;
            color: #2f855a;
            border: 3px solid #68d391;
        }

        .result-lose {
            background: #fed7d7;
            color: #c53030;
            border: 3px solid #fc8181;
        }

        .result-buttons {
            margin-top: 20px;
            display: flex;
            gap: 15px;
            justify-content: center;
            flex-wrap: wrap;
        }

        /* Responsive */
        @media (max-width: 768px) {
            .game-container {
                padding: 20px;
                margin: 10px;
            }

            .game-title {
                font-size: 2em;
            }

            .word-display {
                font-size: 1.8em;
                letter-spacing: 5px;
            }

            .letter-space {
                width: 35px;
                height: 45px;
                line-height: 45px;
            }

            .game-header {
                flex-direction: column;
                text-align: center;
            }

            .difficulty-buttons,
            .category-buttons {
                flex-direction: column;
                align-items: center;
            }
        }

        /* Animaciones */
        .bounce-in {
            animation: bounceIn 0.6s ease;
        }

        @keyframes bounceIn {
            0% {
                transform: scale(0.3);
                opacity: 0;
            }
            50% {
                transform: scale(1.05);
            }
            70% {
                transform: scale(0.9);
            }
            100% {
                transform: scale(1);
                opacity: 1;
            }
        }
    </style>
</head>
<body>
    <div class="game-container">
        <h1 class="game-title">🎯 JUEGO DEL AHORCADO</h1>

        <!-- Pantalla de selección de dificultad -->
        <div id="difficulty-screen" class="screen active difficulty-screen">
            <h2>🎚️ Selecciona la Dificultad</h2>
            <div class="difficulty-buttons">
                <button class="btn btn-easy" onclick="selectDifficulty('facil', 8)">
                    🟢 FÁCIL<br><small>8 errores máximos</small>
                </button>
                <button class="btn btn-medium" onclick="selectDifficulty('medio', 6)">
                    🟡 MEDIO<br><small>6 errores máximos</small>
                </button>
                <button class="btn btn-hard" onclick="selectDifficulty('dificil', 4)">
                    🔴 DIFÍCIL<br><small>4 errores máximos</small>
                </button>
            </div>
        </div>

        <!-- Pantalla de selección de categoría -->
        <div id="category-screen" class="screen category-screen">
            <h2>📂 Selecciona la Categoría</h2>
            <div class="difficulty-info">
                <span id="difficulty-display">Dificultad seleccionada</span>
            </div>
            <div class="category-buttons">
                <button class="btn btn-category" onclick="startGame('animales')">
                    🐱 ANIMALES
                </button>
                <button class="btn btn-category" onclick="startGame('frutas')">
                    🍎 FRUTAS
                </button>
                <button class="btn btn-category" onclick="startGame('paises')">
                    🌍 PAÍSES
                </button>
                <button class="btn btn-category" onclick="startGame('deportes')">
                    ⚽ DEPORTES
                </button>
                <button class="btn btn-category" onclick="startGame('colores')">
                    🎨 COLORES
                </button>
            </div>
            <button class="btn btn-secondary" onclick="showScreen('difficulty-screen')">
                ⬅️ Cambiar Dificultad
            </button>
        </div>

        <!-- Pantalla del juego -->
        <div id="game-screen" class="screen game-screen">
            <div class="game-header">
                <div class="category-title" id="current-category">Categoría: ANIMALES</div>
                <div class="game-stats">
                    <div class="error-counter" id="error-counter">Errores: 0/6</div>
                    <button class="btn btn-secondary" onclick="showScreen('category-screen')">
                        📋 Cambiar Juego
                    </button>
                </div>
            </div>

            <!-- Área del dibujo del ahorcado -->
            <div class="hangman-area">
                <div class="hangman-drawing">
                    <svg class="hangman-svg" viewBox="0 0 200 250">
                        <!-- Base -->
                        <line class="hangman-part" id="part-1" x1="10" y1="240" x2="100" y2="240" stroke="#8B4513" stroke-width="4"/>
                        <!-- Poste vertical -->
                        <line class="hangman-part" id="part-2" x1="30" y1="240" x2="30" y2="20" stroke="#8B4513" stroke-width="4"/>
                        <!-- Poste horizontal -->
                        <line class="hangman-part" id="part-3" x1="30" y1="20" x2="120" y2="20" stroke="#8B4513" stroke-width="4"/>
                        <!-- Cuerda -->
                        <line class="hangman-part" id="part-4" x1="120" y1="20" x2="120" y2="50" stroke="#DAA520" stroke-width="2"/>
                        <!-- Cabeza -->
                        <circle class="hangman-part" id="part-5" cx="120" cy="65" r="15" fill="none" stroke="#2c3e50" stroke-width="3"/>
                        <!-- Cuerpo -->
                        <line class="hangman-part" id="part-6" x1="120" y1="80" x2="120" y2="150" stroke="#2c3e50" stroke-width="3"/>
                        <!-- Brazo izquierdo -->
                        <line class="hangman-part" id="part-7" x1="120" y1="100" x2="90" y2="120" stroke="#2c3e50" stroke-width="3"/>
                        <!-- Brazo derecho -->
                        <line class="hangman-part" id="part-8" x1="120" y1="100" x2="150" y2="120" stroke="#2c3e50" stroke-width="3"/>
                        <!-- Pierna izquierda -->
                        <line class="hangman-part" id="part-9" x1="120" y1="150" x2="90" y2="190" stroke="#2c3e50" stroke-width="3"/>
                        <!-- Pierna derecha -->
                        <line class="hangman-part" id="part-10" x1="120" y1="150" x2="150" y2="190" stroke="#2c3e50" stroke-width="3"/>
                    </svg>
                </div>
            </div>

            <!-- Palabra a adivinar -->
            <div class="word-display" id="word-display">
                <!-- Las letras se generan dinámicamente -->
            </div>

            <!-- Área de input -->
            <div class="input-area" id="input-area">
                <input type="text" 
                       class="letter-input" 
                       id="letter-input" 
                       maxlength="1" 
                       placeholder="?"
                       autocomplete="off">
                <button class="btn btn-primary guess-btn" onclick="guessLetter()">
                    ✅ ADIVINAR
                </button>
            </div>

            <!-- Letras usadas -->
            <div class="used-letters" id="used-letters-area" style="display: none;">
                <h3>Letras Usadas:</h3>
                <div class="letters-grid" id="letters-grid">
                    <!-- Las letras usadas se muestran aquí -->
                </div>
            </div>

            <!-- Resultado del juego -->
            <div class="game-result" id="game-result" style="display: none;">
                <div id="result-message">Mensaje del resultado</div>
                <div class="result-buttons">
                    <button class="btn btn-primary" onclick="playAgain()">
                        🔄 JUGAR DE NUEVO
                    </button>
                    <button class="btn btn-secondary" onclick="showScreen('category-screen')">
                        📋 CAMBIAR CATEGORÍA
                    </button>
                </div>
            </div>
        </div>
    </div>

    <script>
        // Variables globales del juego
        let currentDifficulty = '';
        let maxErrors = 6;
        let currentErrors = 0;
        let currentWord = '';
        let currentCategory = '';
        let usedLetters = [];
        let gameEnded = false;

        // Palabras por categoría
        const wordCategories = {
            animales: [
                'PERRO', 'GATO', 'ELEFANTE', 'LEON', 'TIGRE', 'OSO', 'LOBO', 'ZORRO',
                'CONEJO', 'CABALLO', 'VACA', 'CERDO', 'OVEJA', 'CABRA', 'POLLO',
                'PATO', 'GANSO', 'PAVO', 'AGUILA', 'HALCON', 'BUHO', 'LORO',
                'CANARIO', 'PINGUINO', 'DELFIN', 'BALLENA', 'TIBURON', 'PEZ',
                'TORTUGA', 'SERPIENTE', 'LAGARTO', 'COCODRILO', 'RANA', 'SAPO'
            ],
            frutas: [
                'MANZANA', 'PERA', 'PLATANO', 'NARANJA', 'LIMON', 'FRESA', 'UVA',
                'CEREZA', 'DURAZNO', 'MELOCOTON', 'SANDIA', 'MELON', 'PIÑA',
                'MANGO', 'PAPAYA', 'KIWI', 'COCO', 'AGUACATE', 'TOMATE',
                'PEPINO', 'ZANAHORIA', 'LECHUGA', 'CEBOLLA', 'AJO', 'PAPA'
            ],
            paises: [
                'ESPAÑA', 'FRANCIA', 'ITALIA', 'ALEMANIA', 'PORTUGAL', 'HOLANDA',
                'BELGICA', 'SUIZA', 'AUSTRIA', 'GRECIA', 'TURQUIA', 'RUSIA',
                'CHINA', 'JAPON', 'INDIA', 'AUSTRALIA', 'BRASIL', 'ARGENTINA',
                'CHILE', 'PERU', 'COLOMBIA', 'VENEZUELA', 'ECUADOR', 'BOLIVIA',
                'URUGUAY', 'PARAGUAY', 'MEXICO', 'CANADA', 'ESTADOS UNIDOS'
            ],
            deportes: [
                'FUTBOL', 'BASQUET', 'TENIS', 'VOLEIBOL', 'NATACION', 'ATLETISMO',
                'GIMNASIA', 'CICLISMO', 'BOXEO', 'KARATE', 'JUDO', 'TAEKWONDO',
                'ESGRIMA', 'GOLF', 'HOCKEY', 'RUGBY', 'BEISBOL', 'SOFTBALL',
                'PING PONG', 'BADMINTON', 'SQUASH', 'BOWLING', 'BILLAR',
                'AJEDREZ', 'SURF', 'ESQUI', 'SNOWBOARD', 'PATINAJE'
            ],
            colores: [
                'ROJO', 'AZUL', 'VERDE', 'AMARILLO', 'NARANJA', 'MORADO',
                'ROSA', 'NEGRO', 'BLANCO', 'GRIS', 'MARRON', 'BEIGE',
                'TURQUESA', 'VIOLETA', 'INDIGO', 'MAGENTA', 'CYAN',
                'DORADO', 'PLATEADO', 'BRONCE', 'CORAL', 'SALMON',
                'LAVANDA', 'OLIVA', 'BORGOÑA', 'ESMERALDA'
            ]
        };

        // Función para mostrar una pantalla específica
        function showScreen(screenId) {
            // Ocultar todas las pantallas
            document.querySelectorAll('.screen').forEach(screen => {
                screen.classList.remove('active');
            });
            
            // Mostrar la pantalla seleccionada
            document.getElementById(screenId).classList.add('active');
        }

        // Función para seleccionar dificultad
        function selectDifficulty(difficulty, errors) {
            currentDifficulty = difficulty;
            maxErrors = errors;
            
            document.getElementById('difficulty-display').textContent = 
                `Dificultad: ${difficulty.toUpperCase()} (${errors} errores máximos)`;
            
            showScreen('category-screen');
        }

        // Función para iniciar el juego
        function startGame(category) {
            currentCategory = category;
            
            // Seleccionar palabra aleatoria
            const words = wordCategories[category];
            currentWord = words[Math.floor(Math.random() * words.length)];
            
            // Reiniciar variables del juego
            currentErrors = 0;
            usedLetters = [];
            gameEnded = false;
            
            // Actualizar interfaz
            document.getElementById('current-category').textContent = 
                `Categoría: ${category.toUpperCase()}`;
            
            updateErrorCounter();
            displayWord();
            resetHangman();
            clearUsedLetters();
            hideGameResult();
            
            // Mostrar pantalla del juego y enfocar input
            showScreen('game-screen');
            document.getElementById('letter-input').focus();
        }

        // Función para mostrar la palabra con guiones
        function displayWord() {
            const wordDisplay = document.getElementById('word-display');
            let displayHTML = '';
            
            for (let letter of currentWord) {
                if (letter === ' ') {
                    displayHTML += '<span class="letter-space" style="border: none; width: 20px;"> </span>';
                } else if (usedLetters.includes(letter)) {
                    displayHTML += `<span class="letter-space">${letter}</span>`;
                } else {
                    displayHTML += '<span class="letter-space">_</span>';
                }
            }
            
            wordDisplay.innerHTML = displayHTML;
        }

        // Función para actualizar el contador de errores
        function updateErrorCounter() {
            document.getElementById('error-counter').textContent = 
                `Errores: ${currentErrors}/${maxErrors}`;
        }

        // Función para mostrar una parte del ahorcado
        function showHangmanPart(partNumber) {
            const part = document.getElementById(`part-${partNumber}`);
            if (part) {
                part.classList.add('visible');
                part.classList.add('bounce-in');
            }
        }

        // Función para reiniciar el dibujo del ahorcado
        function resetHangman() {
            for (let i = 1; i <= 10; i++) {
                const part = document.getElementById(`part-${i}`);
                if (part) {
                    part.classList.remove('visible', 'bounce-in');
                }
            }
        }

        // Función para adivinar una letra
        function guessLetter() {
            if (gameEnded) return;
            
            const input = document.getElementById('letter-input');
            const letter = input.value.toUpperCase().trim();
            
            // Validaciones
            if (!letter) {
                alert('Por favor, ingresa una letra');
                input.focus();
                return;
            }
            
            if (letter.length !== 1) {
                alert('Ingresa solo una letra');
                input.value = '';
                input.focus();
                return;
            }
            
            if (!/[A-ZÁÉÍÓÚÑÜ]/.test(letter)) {
                alert('Ingresa solo letras válidas');
                input.value = '';
                input.focus();
                return;
            }
            
            if (usedLetters.includes(letter)) {
                alert('Ya usaste esa letra');
                input.value = '';
                input.focus();
                return;
            }
            
            // Procesar la letra
            usedLetters.push(letter);
            input.value = '';
            
            // Verificar si la letra está en la palabra
            if (currentWord.includes(letter)) {
                // Letra correcta
                displayUsedLetter(letter, true);
                displayWord();
                checkWin();
            } else {
                // Letra incorrecta
                currentErrors++;
                displayUsedLetter(letter, false);
                updateErrorCounter();
                showHangmanPart(currentErrors);
                checkLose();
            }
            
            // Mantener foco en el input si el juego continúa
            if (!gameEnded) {
                input.focus();
            }
        }

        // Función para mostrar las letras usadas
        function displayUsedLetter(letter, isCorrect) {
            const usedLettersArea = document.getElementById('used-letters-area');
            const lettersGrid = document.getElementById('letters-grid');
            
            usedLettersArea.style.display = 'block';
            
            const letterBadge = document.createElement('span');
            letterBadge.className = `letter-badge ${isCorrect ? 'letter-correct' : 'letter-incorrect'}`;
            letterBadge.textContent = letter;
            letterBadge.classList.add('bounce-in');
            
            lettersGrid.appendChild(letterBadge);
        }

        // Función para limpiar las letras usadas
        function clearUsedLetters() {
            document.getElementById('used-letters-area').style.display = 'none';
            document.getElementById('letters-grid').innerHTML = '';
        }

        // Función para verificar si el jugador ganó
        function checkWin() {
            let hasWon = true;
            for (let letter of currentWord) {
                if (letter !== ' ' && !usedLetters.includes(letter)) {
                    hasWon = false;
                    break;
                }
            }
            
            if (hasWon) {
                gameEnded = true;
                showGameResult(true);
            }
        }

        // Función para verificar si el jugador perdió
        function checkLose() {
            if (currentErrors >= maxErrors) {
                gameEnded = true;
                showGameResult(false);
                
                // Mostrar la palabra completa
                const wordDisplay = document.getElementById('word-display');
                let displayHTML = '';
                for (let letter of currentWord) {
                    if (letter === ' ') {
                        displayHTML += '<span class="letter-space" style="border: none; width: 20px;"> </span>';
                    } else {
                        displayHTML += `<span class="letter-space" style="color: #e53e3e;">${letter}</span>`;
                    }
                }
                wordDisplay.innerHTML = displayHTML;
            }
        }

        // Función para mostrar el resultado del juego
        function showGameResult(won) {
            const gameResult = document.getElementById('game-result');
            const resultMessage = document.getElementById('result-message');
            const inputArea = document.getElementById('input-area');
            
            inputArea.style.display = 'none';
            gameResult.style.display = 'block';
            
            if (won) {
                gameResult.className = 'game-result result-win';
                resultMessage.innerHTML = `
                    🎉 ¡FELICIDADES! 🎉<br>
                    ¡Has ganado el juego!<br>
                    <small>La palabra era: <strong>"${currentWord}"</strong></small>
                `;
            } else {
                gameResult.className = 'game-result result-lose';
                resultMessage.innerHTML = `
                    😢 ¡PERDISTE! 😢<br>
                    Se agotaron los intentos<br>
                    <small>La palabra era: <strong>"${currentWord}"</strong></small>
                `;
            }
        }

        // Función para ocultar el resultado del juego
        function hideGameResult() {
            document.getElementById('game-result').style.display = 'none';
            document.getElementById('input-area').style.display = 'block';
        }

        // Función para jugar de nuevo
        function playAgain() {
            startGame(currentCategory);
        }

        // Event listeners
        document.addEventListener('DOMContentLoaded', function() {
            // Enter key para adivinar letra
            document.getElementById('letter-input').addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    guessLetter();
                }
            });
            
            // Solo permitir letras en el input
            document.getElementById('letter-input').addEventListener('input', function(e) {
                let value = e.target.value.toUpperCase();
                value = value.replace(/[^A-ZÁÉÍÓÚÑÜ]/g, '');
                if (value.length > 1) value = value.charAt(0);
                e.target.value = value;
            });
            
            console.log('🎯 Juego del Ahorcado completamente cargado y listo para jugar!');
        });
    </script>
</body>
</html>