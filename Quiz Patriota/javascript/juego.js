const questions = [
    {
        question: "¿Quién comandó las tropas dominicanas en la Batalla del 19 de marzo?",

        answers: [
            { text: "Juan Pablo Duarte", correct: false },
            { text: "Antonio Duvergé", correct: false },
            { text: " Pedro Santana", correct: true },
            { text: "Faustino Soulouque", correct: false }
        ]
    },
    {
        question: "¿Quién lideró las fuerzas dominicanas en la Batalla del 30 de marzo de 1844?",
        answers: [
            { text: " Pedro Santana", correct: false },
            { text: "José María Imbert", correct: true },
            { text: " Antonio Duvergé", correct: false }, 
            { text: "Faustino Soulouque", correct: false }
        ]
    },
    {
        question: "¿Qué estrategia ayudó a la victoria dominicana en Santiago?",
        answers: [
            { text: "Uso de barcos de guerra", correct: false },
            { text: " Apoyo de tropas extranjeras", correct: false },
            { text: "Refuerzos enviados desde Haití", correct: false },
            { text: " Emboscadas y ataques sorpresa ", correct: true }
        ]
    },
    {
        question: "¿Qué destacamento dominicano luchó en la Batalla del Memiso?",
        answers: [
            { text: "Las tropas de Antonio Duvergé", correct: true },
            { text: " Ejército de Juan Pablo Duarte", correct: false },
            { text: " Tropas francesas aliada", correct: false },
            { text: "Ejército español", correct: false }
        ]
    },
    {
        question: "¿Cuál fue la primera constitución de la República Dominicana y en qué año se promulgó?",
        answers: [
            { text: "Constitución de Santiago en 1850", correct: false },
            { text: " Constitución de Santo Domingo en 1845", correct: false },
            { text: " Constitución de San Cristóbal en 1844", correct: true },
            { text: "Constitución de La Vega en 1863", correct: false }
        ]
    },
    {
        question: "¿Qué tipo de combate ocurrió en Puerto Tortuguero?",
        answers: [
            { text: " Naval", correct: true },
            { text: " Aéreo", correct: false },
            { text: "Terrestre", correct: false },
            { text: " Urbano", correct: false }
        ]
    },

    {
        question: "¿Quién comandó las tropas dominicanas en la Batalla de la Estrelleta?",
        answers: [
            { text: "Pedro Santana", correct: false },
            { text: "Antonio Duvergé", correct: true },
            { text: "Juan Pablo Duarte", correct: false },
            { text: " Faustino Soulouque", correct: false }
        ]
    },
 
    {
        question: "¿Cuál fue el resultado de la Batalla de la Estrelleta?",
        answers: [
            { text: " Haití logró invadir el país", correct: false },
            { text: "Se firmó un tratado de paz", correct: false },
            { text: "España recuperó la isla", correct: false },
            { text: "Victoria dominicana", correct: true }
        ]
    },
    {
        question: "¿Qué consecuencia tuvo la Batalla de Sabana Larga?",
        answers: [
            { text: " Haití anexó República Dominicana", correct: false },
            { text: " Se firmó un tratado de anexión con Francia", correct: false },
            { text: " Haití abandonó sus intentos de invasión", correct: true },
            { text: "Pedro Santana renunció", correct: false }
        ]
    },
    {
        question: "¿Dónde tuvo lugar la Batalla de Beller?",
        answers: [
            { text: "Santo Domingo", correct: false },
            { text: " Dajabón", correct: true },
            { text: "San Juan", correct: false },
            { text: " Santiago", correct: false }
        ]
    },
    {
        question: "¿Qué general dominicano dirigió la Batalla de Santomé??",
        answers: [
            { text: " Pedro Santana", correct: false },
            { text: "Juan Pablo Duarte", correct: false },
            { text: " José María Cabral", correct: true },
            { text: " Faustino Soulouque", correct: false }
        ]
    },
  
  
];


const questionElement = document.getElementById('question');
const answerButtons = document.getElementById('answer-buttons');
const nextBtn = document.getElementById('next-btn');

let currentQuestionIndex = 0;
let score = 0;

function startQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    nextBtn.innerText = 'Siguiente';
    showQuestion();
}

function showQuestion() {
    resetState();

    let currentQuestion = questions[currentQuestionIndex];
    let questionNo = currentQuestionIndex + 1;
    questionElement.innerText = questionNo + ". " + currentQuestion.question;

    currentQuestion.answers.forEach(answer => {
        const button = document.createElement('button');
        button.innerText = answer.text;
        button.classList.add('btn');
        if (answer.correct) {
            button.dataset.correct = answer.correct;
        }
        button.addEventListener('click', selectAnswer);
        answerButtons.appendChild(button);
    });
}

function resetState() {
    nextBtn.style.display = 'none';
    while (answerButtons.firstChild) {
        answerButtons.removeChild(answerButtons.firstChild);
    }
}

function selectAnswer(e) {
    const selectedBtn = e.target;
    const correct = selectedBtn.dataset.correct;

    Array.from(answerButtons.children).forEach(button => {
        if (button.dataset.correct) {
            button.classList.add('correct');
        } else {
            button.classList.add('incorrect');
        }
    });

    if (correct) {
        score++;
    }

    selectedBtn.classList.add(correct ? 'correct' : 'incorrect');
    Array.from(answerButtons.children).forEach(button => {
        button.disabled = true;
    });
    nextBtn.style.display = 'block';
}

function showScore() {
    resetState();

    let message;
    if (score <= 5) {
        message = "Estas quemado en sociales";
    } else if (score > 5 && score < 10) {
        message = "Nada mal, pero puedes mejorar";
    } else if (score >= 10 && score <= 12) {
        message = "Muy bien";
    } else if (score == 13) {
        message = "¡Tienes un 100 con Rosa!";
    }

    questionElement.innerText = `Has acertado ${score} de ${questions.length}. ${message}`;
    nextBtn.innerText = 'Play Again';
    nextBtn.style.display = 'block';
}


function handleNextButton() {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        showQuestion();
    } else {
        showScore();
    }
}

nextBtn.addEventListener('click', () => {
    if (currentQuestionIndex < questions.length) {
        handleNextButton();
    } else {
        startQuiz();
    }
});

startQuiz();


