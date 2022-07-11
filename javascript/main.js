import {casas} from "./arrayCasas.js"

/*--------Filtro de casas--------*/ 
const selectorBarrio = document.getElementById("selecBarrio");

selectorBarrio.addEventListener("change", () => {
    console.log(selectorBarrio.value);
    if(selectorBarrio.value=="all"){
        mostrarCasas (casas);
    } else {
        mostrarCasas(casas.filter(elemento => elemento.barrio == selectorBarrio.value));
    }
})

/*--------Renderizado de casas--------*/ 
const contenedorCasas = document.getElementById("contenedor-cards");

function mostrarCasas (array) {
    contenedorCasas.innerHTML = "";
    array.forEach(el => {
        let div = document.createElement("div");
        div.className = `container`;
        div.className = `col-md-3`;
        div.innerHTML = `<div class="card">
                            <img src="${el.image}" alt="Casa" class="img-fluid">
                            <h4 class="text-center my-3 text-uppercase">${el.barrio}</h4>
                            <p class="text-center">Habitaciones: ${el.habitaciones} <br>
                                                    Baños: ${el.banios} <br>
                                                    Mts2: ${el.mts2} <br>
                                                    Precio: $${el.precio}</p>
                            <div class="centrar-boton">
                                <a id="boton${el.id}" class="boton-agregar">Quiero visitarla!</a>
                            </div>
                        </div>`
        
        contenedorCasas.appendChild(div);

        // Le agrego el evento a cada boton para agregar a la agenda
        let btnAgregar = document.getElementById(`boton${el.id}`);
        btnAgregar.addEventListener("click", () => {
            agregarAgenda(el.id);
            Toastify ({
                text: "Casa añadida con éxito!",
                duration: 2500,
                gravity: "bottom",
                position: "right",
                //Modificar el background color para que quede bien con la página!
            }).showToast();
        })

    });
}
mostrarCasas(casas);


//Creo un array vacio de la agenda
let agendaVisitas = [];


//Funcion agregar a la agenda
function agregarAgenda(id) {
    let casaAgregar = casas.find(item => item.id == id);
    agendaVisitas.push(casaAgregar);
    mostrarCasasEnModal(casaAgregar); // A medida que se va agregando la casa al array, se la muestra en la agenda.
    actualizarAgenda();
    localStorage.setItem("agenda", JSON.stringify(agendaVisitas));
}


//Renderizar las casas que se agregan a la agenda

let contenedorAgenda = document.getElementById("contenedor-agenda")

function mostrarCasasEnModal (casaAgregar) {
    let div = document.createElement(`div`);
    div.innerHTML = `<div class="row container agenda-flex">
                        <div class="col-md-3">
                            <img src="${casaAgregar.image}" alt="Casa" class="img-fluid img-agenda">
                        </div>
                        <div class="col-md-3">
                            <h3 class="titulo-agenda">${casaAgregar.barrio}</h3>
                            <p>Habitaciones: ${casaAgregar.habitaciones} <br>
                                Baños: ${casaAgregar.banios} <br>
                                Mts2: ${casaAgregar.mts2} <br>
                                precio:$${casaAgregar.precio}</p>
                        </div>
                        <div class="col-md-3">
                            <h5 class="fecha-titulo">Seleccione una fecha para la visita</h5>
                            <input type="date" name="Calendario" min="2022/07/06" max="2023/01/01" id="nada" class="calendario">
                            <div class="row botones-agenda">
                                <div><button class="btn-confirmar elemento-a-reemplazar" id="btn-confirmar-${casaAgregar.id}">Confirmar</button></div>
                                <div><button class="btn-eliminar" id="btn-eliminar-${casaAgregar.id}" dataset-item="item">Eliminar cita</button></div>
                            </div>
                        </div>
                    </div>`

    contenedorAgenda.appendChild(div);
    
    
    //Boton para eliminar una casa del modal
    let btnEliminar = document.getElementById(`btn-eliminar-${casaAgregar.id}`);
    btnEliminar.addEventListener("click", () => {
        btnEliminar.parentElement.parentElement.parentElement.parentElement.remove(); // Tiene que haber una mejor forma de hacer esto en vez de escribir parentElement 4 veces.
        agendaVisitas = agendaVisitas.filter(el => el.id !== casaAgregar.id)
        actualizarAgenda();
        localStorage.setItem(`agenda`, JSON.stringify(agendaVisitas));
    })
 
    const btnConfirmarFecha = document.getElementById(`btn-confirmar-${casaAgregar.id}`);
    btnConfirmarFecha.addEventListener("click", ()=>{
        swal({
            title: "Listo!",
            text: "Se agendó la visita para la fecha seleccionada",
            icon: "success",
            showConfirmButton: false,
        }
        )
    })
}


//Funcion de actualizar la agenda (el numerito que se ve en la página principal)
let contadorAgenda = document.getElementById("contador-agenda");
function actualizarAgenda() {
    contadorAgenda.innerText= "("+agendaVisitas.length+")";
}


//Función de recuperar todo lo guardado cuando refresco la página
function recuperar () {
    let recuperarLS = JSON.parse(localStorage.getItem("agenda"))||[];
    for (const elemento of recuperarLS) {
        mostrarCasasEnModal(elemento);
        agendaVisitas.push(elemento);
        actualizarAgenda();
    }
}
recuperar();

// Modal

const modal = document.querySelector(".ventana-emergente");
const openModal = document.getElementById("abrir-modal");
const closeModal = document.querySelector(".modal-close");

openModal.addEventListener("click", () => {
    modal.classList.toggle("modal-show");
});

closeModal.addEventListener("click", () => {
    modal.classList.toggle("modal-show");
})

//Sweet alert al boton de enviar formulario
// const botonFormulario = document.querySelector(".boton-contacto");
// botonFormulario.addEventListener("click", ()=>{
//     swal({
//         title: "Genial",
//         text: "Tu consulta ha sido enviada con éxito!",
//         icon: "success",
//         showConfirmButton: false,
//     })
// })

//Validación del formulario.

let nombre = document.getElementById("formulario-nombre");
let apellido = document.getElementById("formulario-apellido");
let email = document.getElementById("formulario-email");
let textArea = document.querySelector(".textarea-contacto");
const botonFormulario = document.querySelector(".boton-contacto");

const formulario = document.getElementById("formulario");
formulario.addEventListener("input", (e) => {
    e.preventDefault();
    if((nombre.value.length != 0) && (apellido.value.length != 0) && (email.value.length !=0) && (textArea.value.length != 0)) {
        botonFormulario.addEventListener("click", () => {
            swal ({
                title: "Genial",
                text: "Tu mensaje ha sido enviado con éxito!",
                icon: "success",
            })
        })
    } else {
        botonFormulario.addEventListener ("click", () => {
            swal ({
                title: "Error",
                text: "Debe completar todos los campos correctamente",
                icon: "error",
            })
        })
    }
});