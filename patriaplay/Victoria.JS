function reiniciarjuego() {
    // Redirigir a index.html
    window.location.href = "inicio.html";

    // Reemplazar la entrada del historial para evitar que el usuario regrese
    history.replaceState(null, document.title, "inicio.html");
}
// Asignar la función al botón
document.querySelector('button').addEventListener('click', reiniciarjuego);
