// Función para cambiar el color del texto según el fondo
function cambiarColorTexto() {
    const seccion = document.querySelector('.historia-dominicana');
    const fondo = document.querySelector('.historia-fondo');
    const contenido = document.querySelector('.historia-contenido');
  
    // Obtener el color de fondo actual
    const estiloFondo = window.getComputedStyle(fondo).backgroundColor;
  
    // Cambiar el color del texto según el fondo
    if (estiloFondo === 'rgba(255, 255, 255, 0.911)') { // Fondo blanco
      contenido.style.color = '#002D62'; // Azul oscuro para contraste
    } else {
      contenido.style.color = 'white'; // Blanco para otros fondos
    }
  }
  
  // Ejecutar la función cuando cambia el fondo
  setInterval(cambiarColorTexto, 100); // Verifica el fondo cada 100ms