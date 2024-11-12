const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const mainMenu = document.getElementById('main-menu');
const controlsScreen = document.getElementById('controls-screen');
const gameContainer = document.getElementById('game-container');
const playButton = document.getElementById('play-button');
const controlsButton = document.getElementById('controls-button');
const backButton = document.getElementById('back-button');
const scoreElement = document.getElementById('score');
const speedSelect = document.getElementById('speed-select');
const gameMessage = document.getElementById('game-message');
const gameOverMessage = document.getElementById('game-over-message');
const finalScore = document.getElementById('final-score');

const scale = 20;
const rows = canvas.height / scale;
const columns = canvas.width / scale;

let snake = [{ x: 5 * scale, y: 5 * scale }];
let direction = 'RIGHT';
let food = generateFood();
let score = 0;
let gameStarted = false;
let gameInterval;
let gameSpeed = 150;

playButton.addEventListener('click', startGameFromMenu);
controlsButton.addEventListener('click', showControls);
backButton.addEventListener('click', backToMenu);
document.addEventListener('keydown', startGame);
document.addEventListener('keydown', changeDirection);
document.addEventListener('keydown', restartGame); 
speedSelect.addEventListener('change', updateGameSpeed);

function gameLoop() {
    if (isGameOver()) {
        showGameOver();
        return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawFood();
    moveSnake();
    drawSnake();
    updateScore();
}


function moveSnake() {
    const head = { ...snake[0] };

    switch (direction) {
        case 'UP':
            head.y -= scale;
            break;
        case 'DOWN':
            head.y += scale;
            break;
        case 'LEFT':
            head.x -= scale;
            break;
        case 'RIGHT':
            head.x += scale;
            break;
    }

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        food = generateFood();
        score++;
    } else {
        snake.pop();
    }
}

function drawSnake() {
    snake.forEach((segment, index) => {
        ctx.fillStyle = index === 0 ? '#0f0' : '#00ff00';
        ctx.fillRect(segment.x, segment.y, scale, scale);
    });
}

function drawFood() {
    ctx.fillStyle = '#ff0000';
    ctx.fillRect(food.x, food.y, scale, scale);
}

function generateFood() {
    let foodPosition;
    let foodOnSnake;

    // Repetimos hasta encontrar una posición de comida que no esté en la serpiente
    do {
        const x = Math.floor(Math.random() * columns) * scale;
        const y = Math.floor(Math.random() * rows) * scale;
        foodPosition = { x, y };

        // Comprobar si la comida está en la serpiente
        foodOnSnake = snake.some(segment => segment.x === foodPosition.x && segment.y === foodPosition.y);
    } while (foodOnSnake);

    return foodPosition;
}


function changeDirection(event) {
    if (!gameStarted) return; // No permitir cambio de dirección antes de empezar el juego

    const keyPressed = event.keyCode;

    if (keyPressed === 37 && direction !== 'RIGHT') {
        direction = 'LEFT';
    } else if (keyPressed === 38 && direction !== 'DOWN') {
        direction = 'UP';
    } else if (keyPressed === 39 && direction !== 'LEFT') {
        direction = 'RIGHT';
    } else if (keyPressed === 40 && direction !== 'UP') {
        direction = 'DOWN';
    }
}

function startGame(event) {
    if (gameStarted && event.keyCode) {
        if (!gameInterval) {
            gameInterval = setInterval(gameLoop, gameSpeed);
            gameMessage.style.display = 'none';
        }
    }
}

function startGameFromMenu() {
    mainMenu.classList.add('hidden');
    gameContainer.classList.remove('hidden');
    gameStarted = true;
    gameMessage.style.display = 'block';
}

function showControls() {
    mainMenu.classList.add('hidden'); // Ocultar el menú principal
    controlsScreen.classList.remove('hidden'); // Mostrar la pantalla de controles
}



function isGameOver() {
    const head = snake[0];

    if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height) {
        return true;
    }

    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            return true;
        }
    }

    return false;
}

function updateScore() {
    scoreElement.textContent = score;
}
function showGameOver() {
    finalScore.textContent = score;
    gameOverMessage.classList.remove('hidden');
    restartButton.classList.remove('hidden');  // Mostrar el botón de reiniciar
    clearInterval(gameInterval);  // Detener el juego
    gameInterval = null;
}
const restartButton = document.getElementById('restart-button');  // Referencia al botón de reiniciar

// Agregar el evento de clic al botón de reiniciar
restartButton.addEventListener('click', backToMenu);

// Función que se ejecuta cuando el jugador presiona el botón de volver al inicio
function backToMenu() {
    // Ocultar el contenedor del juego y mostrar el menú principal
    gameContainer.classList.add('hidden');
    mainMenu.classList.remove('hidden');
    controlsScreen.classList.add('hidden');

    // Detener cualquier intervalo del juego
    clearInterval(gameInterval);
    gameInterval = null;

    // Resetear los valores del juego
    snake = [{ x: 5 * scale, y: 5 * scale }];
    direction = 'RIGHT';
    food = generateFood();
    score = 0;
    gameStarted = false;
    gameOverMessage.classList.add('hidden');
    gameMessage.style.display = 'none';  // Ocultar el mensaje de Game Over

    // Ocultar el botón de reiniciar
    restartButton.classList.add('hidden');
}

function restartGame(event) {
    restartButton.classList.add('hidden');
    if (isGameOver()) {
        // Reiniciar el juego cuando el jugador presiona cualquier tecla después de perder
        if (event.keyCode) {
            // Resetear el estado del juego
            snake = [{ x: 5 * scale, y: 5 * scale }];
            direction = 'RIGHT';
            food = generateFood();
            score = 0;
            gameStarted = true; // Asegurarse de que el juego haya comenzado
            gameOverMessage.classList.add('hidden');
            gameMessage.style.display = 'none'; // Esconder el mensaje de "Game Over"
            
            // Llamar a la función que actualizará la velocidad según la selección
            updateGameSpeed(); // Esta función se encarga de actualizar la velocidad y reiniciar el intervalo

            // Ya no es necesario reiniciar el intervalo aquí, ya que lo hace la función `updateGameSpeed`
        }
    }
}

function updateGameSpeed() {
    const speed = speedSelect.value;

    switch (speed) {
        case 'slow':
            gameSpeed = 180;  // Velocidad lenta
            break;
        case 'normal':
            gameSpeed = 100;  // Velocidad normal
            break;
        case 'fast':
            gameSpeed = 80;  // Velocidad rápida
            break;
        default:
            gameSpeed = 100;  // Valor predeterminado si no hay selección
    }

    // Si ya existe un intervalo, lo cancelamos y lo reiniciamos con la nueva velocidad
    if (gameInterval) {
        clearInterval(gameInterval);
        gameInterval = setInterval(gameLoop, gameSpeed);
    }
}

