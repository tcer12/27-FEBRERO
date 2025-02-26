const contenedor = document.getElementById("puzzle");
const mensaje = document.getElementById("mensaje");
const imgURL = "img/concepcion.jpg"; 
let posiciones = [];

function crearRompecabezas() {
    let indices = [...Array(9).keys()];
    indices = indices.sort(() => Math.random() - 0.5); 

    indices.forEach((index, pos) => {
        const pieza = document.createElement("div");
        pieza.classList.add("piece");
        pieza.style.backgroundImage = `url(${imgURL})`;
        pieza.style.backgroundPosition = `${-100 * (index % 3)}px ${-100 * Math.floor(index / 3)}px`;
        pieza.draggable = true;
        pieza.dataset.index = index;
        pieza.addEventListener("dragstart", arrastrar);
        pieza.addEventListener("dragover", permitirSoltar);
        pieza.addEventListener("drop", soltar);
        contenedor.appendChild(pieza);
        posiciones[pos] = index;
    });
}

function arrastrar(e) {
    e.dataTransfer.setData("text/plain", e.target.dataset.index);
}

function permitirSoltar(e) {
    e.preventDefault();
}

function soltar(e) {
    e.preventDefault();
    let origen = e.dataTransfer.getData("text/plain");
    let destino = e.target.dataset.index;
    
    let piezas = [...contenedor.children];
    let posOrigen = posiciones.indexOf(parseInt(origen));
    let posDestino = posiciones.indexOf(parseInt(destino));

    [posiciones[posOrigen], posiciones[posDestino]] = [posiciones[posDestino], posiciones[posOrigen]];

    contenedor.innerHTML = "";
    posiciones.forEach(idx => {
        let pieza = piezas.find(p => p.dataset.index == idx);
        contenedor.appendChild(pieza);
    });
}

function verificarOrden() {
    let correcto = posiciones.every((val, idx) => val === idx);
    mensaje.textContent = correcto ? "¡Estan en Orden!  " : "Te equivocaste. Vuelve a intentar.";
}

crearRompecabezas();