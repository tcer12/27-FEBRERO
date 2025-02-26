let imagenes = [
 {
     "url": "img/1.jpg",
     "nombre": "paso 01",
     "descripcion": "Elije tu respuesta"

 },
 {
     
  "url": "img/2.jpg",
     "nombre": "paso 02",
     "descripcion": "Haga click en la respuesta que eligio"

 },
 {
     "url": "img/3.jpg",
     "nombre": "Paso 03",
     "descripcion": "Si tu respuesta es correcta pasaras a la siguiente pregunta"

 },

 {
  "url": "img/4.jpg",
  "nombre": "Paso 04",
  "descripcion": "Si la respuesta es erronea, le mostara una pequeña biografía"

},

{
 "url": "img/5.jpg",
 "nombre": "paso 05",
 "descripcion": "Si aciertas la mayoria de preguntas te ganas un premio sorpresa."

},
]


let atras = document.getElementById('atras');
let adelante = document.getElementById('adelante');
let imagen = document.getElementById('img');
let puntos = document.getElementById('puntos');
let texto = document.getElementById('texto')
let actual = 0
posicionCarrusel()

atras.addEventListener('click', function(){
 actual -=1

 if (actual == -1){
     actual = imagenes.length - 1
 }

 imagen.innerHTML = ` <img class="img" src="${imagenes[actual].url}" alt="logo pagina" loading="lazy"></img>`
 texto.innerHTML = `
 <h3>${imagenes[actual].nombre}</h3>
 <p>${imagenes[actual].descripcion}</p>
 `
 posicionCarrusel()
})  
adelante.addEventListener('click', function(){
 actual +=1

 if (actual == imagenes.length){
     actual = 0
 }

 imagen.innerHTML = ` <img class="img" src="${imagenes[actual].url}" alt="logo pagina" loading="lazy"></img>`
 texto.innerHTML = `
 <h3>${imagenes[actual].nombre}</h3>
 <p>${imagenes[actual].descripcion}</p>
 `
 posicionCarrusel()
})  

function posicionCarrusel() {
 puntos.innerHTML = ""
 for (var i = 0; i <imagenes.length; i++){
     if(i == actual){
         puntos.innerHTML += '<p class="bold">.<p>'
     }
     else{
         puntos.innerHTML += '<p>.<p>'
     }
 } 
}