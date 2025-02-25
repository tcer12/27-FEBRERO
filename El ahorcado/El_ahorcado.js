// Selección de elementos del DOM
const keyboardDiv = document.querySelector(".keyboard");
const wordDisplay = document.querySelector(".word-display");
const hintText = document.querySelector(".hint-text b");
const guessesText = document.querySelector(".guesses-text b");
const modal = document.querySelector(".game-modal");
const modalWord = document.querySelector(".correct-word");
const playAgainBtn = document.querySelector(".play-again");
const modal2 = document.querySelector(".game-modal2");
const playNextBtn = document.querySelector(".play-next");
const el_ahorcado = document.querySelector(".el_ahorcado-box img");

// Nueva variable para el mensaje
const messageText = document.createElement("p");
messageText.classList.add("message-text");
keyboardDiv.parentNode.insertBefore(messageText, keyboardDiv);

// Variables para almacenar el estado del juego
let currentWord, correctGuesses, incorrectGuesses;

// Función para obtener una palabra aleatoria de la lista
const getRandomWord = () => {
    const randomObj = wordList[Math.floor(Math.random() * wordList.length)];
    currentWord = randomObj.word.toUpperCase();
    hintText.innerText = randomObj.hint;
    correctGuesses = [];
    incorrectGuesses = 0;
    guessesText.innerText = `0 / 6`;
    el_ahorcado.src = "Img_El_ahorcado/hangman-0.svg";

    keyboardDiv.querySelectorAll("button").forEach((btn) => {
        btn.style.color = "";
        btn.style.opacity = 1;
        btn.disabled = false;
    });

    updateWordDisplay();
    messageText.innerText = ""; // Limpia el mensaje al iniciar una nueva palabra
};

// Función para verificar si la letra seleccionada es correcta
const checkLetter = (letter, button) => {
    button.disabled = true;
    button.style.opacity = 0.5;

    const upperLetter = letter.toUpperCase();

    if (currentWord.includes(upperLetter)) {
        correctGuesses.push(upperLetter);
        messageText.innerText = "¡Correcto!";
        messageText.style.color = "green";
    } else {
        incorrectGuesses++;
        el_ahorcado.src = `Img_El_ahorcado/hangman-${incorrectGuesses}.svg`;
        messageText.innerText = "¡Incorrecto!";
        messageText.style.color = "red";
    }

    updateWordDisplay();
    guessesText.innerText = `${incorrectGuesses} / 6`;

    if (new Set(correctGuesses).size === new Set(currentWord).size) {
        setTimeout(() => {
            modal2.style.display = "flex";
        }, 300);
    }

    if (incorrectGuesses >= 6) {
        modalWord.innerText = currentWord;
        modal.style.display = "flex";
    }
};

// Función para actualizar el display de la palabra
const updateWordDisplay = () => {
    wordDisplay.innerHTML = currentWord
        .split("")
        .map((char) => (correctGuesses.includes(char) ? `<li class="letter guessed">${char}</li>` : `<li class="letter"></li>`))
        .join("");
};
// Función para verificar si la letra seleccionada es correcta
const ch= (letter, button) => {
    button.disabled = true;
    button.style.opacity = 0.5;

    const upperLetter = letter.toUpperCase();

    if (currentWord.includes(upperLetter)) {
        correctGuesses.push(upperLetter);
        messageText.innerText = "¡Correcto!"; // Mensaje correcto
        messageText.style.color = "green"; // Estilo correcto (verde)
    } else {
        incorrectGuesses++;
        el_ahorcado.src = `Img_El_ahorcado/hangman-${incorrectGuesses}.svg`;
        messageText.innerText = "¡Incorrecto!"; // Mensaje incorrecto
        messageText.style.color = "red"; // Estilo incorrecto (rojo)
    }

    updateWordDisplay();
    guessesText.innerText = `${incorrectGuesses} / 6`;

    if (new Set(correctGuesses).size === new Set(currentWord).size) {
        setTimeout(() => {
            modal2.style.display = "flex";
        }, 300);
    }

    if (incorrectGuesses >= 6) {
        modalWord.innerText = currentWord;
        modal.style.display = "flex";
    }
};

// Función para crear el teclado
const createKeyboard = () => {
    for (let i = 65; i <= 90; i++) {
        const button = document.createElement("button");
        button.innerText = String.fromCharCode(i);
        button.addEventListener("click", () => checkLetter(button.innerText, button));
        keyboardDiv.appendChild(button);
    }
};

// Evento para reiniciar el juego al hacer clic en "Jugar de nuevo"
playAgainBtn.addEventListener("click", () => {
    modal.style.display = "none";
    getRandomWord(); // Llama a getRandomWord para reiniciar el juego
});

// Evento para jugar la siguiente palabra al hacer clic en "Siguiente"
playNextBtn.addEventListener("click", () => {
    modal2.style.display = "none";
    getRandomWord(); // Llama a getRandomWord para reiniciar el juego
});

// Inicializa el teclado y comienza el juego
createKeyboard();
getRandomWord();