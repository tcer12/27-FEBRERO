// Lista de preguntas y sus respectivas respuestas incorrectas
const preguntas = [
    "pregunta1.html",
    "pregunta2.html",
    "pregunta3.html",
    "pregunta4.html",
    "pregunta5.html",
    "pregunta6.html",
    "pregunta7.html",
    "pregunta8.html",
    "pregunta9.html",
    "pregunta10.html",
    "pregunta11.html",
    "pregunta12.html",
    "pregunta13.html",
    "pregunta14.html", 
    "pregunta15.html"
];

const respuestasIncorrectas = {
    "pregunta1.html": "Respuesta 1.html",
    "pregunta2.html": "Respuesta 2.html",
    "pregunta3.html": "Respuesta 3.html",
    "pregunta4.html": "Respuesta 4.html",
    "pregunta5.html": "Respuesta 5.html",
    "pregunta6.html": "Respuesta 6.html",
    "pregunta7.html": "Respuesta 7.html",
    "pregunta8.html": "RespuestaCorrecta8.html",
    "pregunta9.html": "RespuestaCorrecta9.html",
    "pregunta10.html": "RespuestaCorrecta10.html",
    "pregunta11.html": "RespuestaCorrecta11.html",
    "pregunta12.html": "RespuestaCorrecta12.html",
    "pregunta13.html": "RespuestaCorrecta13.html",
    "pregunta14.html": "RespuestaCorrecta14.html",
    "pregunta15.html": "RespuestaCorrecta15.html"
};

function seleccionarRespuesta(element, esCorrecto) {
    const opciones = document.querySelectorAll('.opcion');
    const botonContinuar = document.getElementById('continuar-btn');
    
    // Reiniciar estilos de todas las opciones
    opciones.forEach(opcion => {
        opcion.classList.remove('correct', 'incorrect');
        opcion.style.backgroundColor = 'white';
    });

    if (esCorrecto) {
        element.style.backgroundColor = 'lightgreen';
        element.classList.add('correct');
        if (botonContinuar) {
            botonContinuar.classList.remove('hidden'); // Muestra el botón de continuar
        }
    } else {
        element.style.backgroundColor = 'lightcoral';
        element.classList.add('incorrect');
        const delay = 1000; // Configurable
        setTimeout(() => {
            let urlActual = window.location.pathname.split("/").pop().toLowerCase();
            if (respuestasIncorrectas[urlActual]) {
                window.location.href = respuestasIncorrectas[urlActual]; // Redirigir a la página específica de explicación
            } else {
                console.error("No se encontró una página de respuesta incorrecta para: " + urlActual);
            }
        }, delay);
    }
}

function continuar(event) {
    if (event) event.preventDefault(); // Evita problemas si se ejecuta desde un formulario

    // Obtener el nombre del archivo actual en minúsculas
    let urlActual = window.location.pathname.split("/").pop().toLowerCase();

    // Si la URL está vacía o es "inicio.html", se asigna la primera pregunta
    if (!urlActual || urlActual === "inicio.html") {
        urlActual = "pregunta1.html";
    }

    // Buscar el índice de la pregunta actual en el array
    const indiceActual = preguntas.indexOf(urlActual);

    // Si hay una siguiente pregunta, redirigir a ella
    if (indiceActual !== -1 && indiceActual < preguntas.length - 1) {
        window.location.href = preguntas[indiceActual + 1];
    } else {
        alert("¡Haz finalizado el cuestionario con exito!");
        window.location.href = "victoria.html";
    }
}
