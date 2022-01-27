
// TUVE QUE USAR LIVESERVER OBLIGATORIAMENTE PARA ESTE TRABAJO
// YA QUE EL API.JSON SIMULA UNA BASE DE DATOS CON MIS PRODUCTOS
// SI POR ALGUNA RAZÓN NO LE CARGAN LAS CARDS DE PRODUCTOS, ABRA EL INDEX.HTML DESDE LIVESERVER (gracias)
// (Estilos del css no terminados)

// Constantes

const cards = document.getElementById('cards');
const items = document.getElementById('items');
const plantillaCard = document.getElementById('template-card').content;
const plantillaCarrito = document.getElementById('template-carrito').content;
const fragment = document.createDocumentFragment();

// Lets
let carrito = {};
// Declaro let para hacer mas legible el código en el *datos.forEach*

let titulo = plantillaCard.querySelector('h4');
let precio = plantillaCard.querySelector('p');
let imagen = plantillaCard.querySelector('img');
let boton = plantillaCard.querySelector('#boton');




// Una vez que se cargue todo el html ejecutar: 

document.addEventListener('DOMContentLoaded', () => {
    buscadorDatos();
})

// Eventos

cards.addEventListener('click', html => {
    agregarCarrito(html);
})

items.addEventListener('click', html => {
    sumarCantidad(html);
})
// Async y Await

const buscadorDatos = async() => { 
    try { // Intenta esto
        const respuesta = await fetch('api.json'); // Espera a que se traiga a api.json
        const datos = await respuesta.json(); // Espera que respuesta sea json
        //console.log(data);
        mostrarCards(datos); 
    } catch (error) { // De otro modo, mostrar error
        console.log(error);
    }
}

// Funciones
// Con querySelector obtengo las etiquetas e id (Ya las guardé en let al principio)
// Y con textContent le asigno a cada propiedad su correspondiente propiedad del objeto
const mostrarCards = (datos) => {
    datos.forEach(producto => {
        // Le asigno las propiedades de los objetos api.json a los let
        precio.textContent = producto.precio;
        titulo.textContent = producto.nombre;
        // Agrego el atributo producto.img al src con .setAttribute
        imagen.setAttribute('src', producto.img);
        
        boton.dataset.id = producto.id; // Seteo un data-id a el boton del html y le agrego el id del objeto

        const clone = plantillaCard.cloneNode(true); // Clonar plantillaCard por cada objeto del api.json

        fragment.appendChild(clone); // Agrego la constante clone con todos los objetos del api.json al fragment
    });
    cards.appendChild(fragment); // Finalmente agrego todo lo que hice al cards
}


const setCarrito = objeto => {
    // console.log(objeto);
    const producto = { // Objeto
        // Accedo a el boton, h4, etc
        
        // Lo guardo en las propiedades del objeto
        id: objeto.querySelector('.boton').dataset.id, // Seteo un id pero al objeto
        nombre: objeto.querySelector('h4').textContent, // nombre sera el textContent del h4
        precio: objeto.querySelector('p').textContent,
        cantidad : 1
    }
    // Si el producto se duplica entonces...

    if (carrito.hasOwnProperty(producto.id)) {
        // Accedo a la coleccion de objetos, luego a el elemento que se repite (producto.id) luego accedo solo a la cantidad con .cantidad y le sumo +1
        producto.cantidad = carrito[producto.id].cantidad + 1;
    }
    // Se agrega el id del producto y dentro del id estará el objeto producto
    carrito[producto.id] = { ...producto } // {...producto significa que distribuye los elementos del objeto al id de la coleccíon de objetos carrito}
    mostrarCarrito();
    // console.log(carrito)
}
const mostrarCarrito = () => {
    // console.log(carrito)
    items.innerHTML = '';
    // Como use objeto en vez de array use Object.values para usar forEach
    Object.values(carrito).forEach(producto => {
        plantillaCarrito.querySelector('th').textContent = producto.id;
        plantillaCarrito.querySelectorAll('td')[0].textContent = producto.nombre;
        plantillaCarrito.querySelectorAll('td')[1].textContent = producto.cantidad;
        plantillaCarrito.querySelector('#boton-sumar').dataset.id = producto.id
        plantillaCarrito.querySelector('#boton-restar').dataset.id = producto.id;
        plantillaCarrito.querySelector('span').textContent = producto.cantidad * producto.precio;

        const clone2 = plantillaCarrito.cloneNode(true);
        fragment.appendChild(clone2);
    })
    items.appendChild(fragment);
}

const agregarCarrito = html => {
    
    // console.log(html.target.classList.contains('boton'));
    
    if (html.target.classList.contains('boton')) {// Si hago lick en un button que contenga la clase 'boton' entonces...
        setCarrito(html.target.parentElement);
    }
    html.stopPropagation(); // Para que solo ingrese al agregarCarrito() si hace click dentro de 'cards'
}
const sumarCantidad = html => {
    // console.log(html.target)
    // Sumar cantidad
    if(html.target.classList.contains('sumar')) {
        
        // si clickeo en el boton sumar creo una constante que es igual al id del producto que agregamos al hacer click (el id contiene el nombre, precio, cantidad, etc)...
        // 
        const producto = carrito[html.target.dataset.id]
        producto.cantidad++;

        carrito[html.target.dataset.id] = {...producto}
        mostrarCarrito();
    }
    if(html.target.classList.contains('restar')) {
        
        // si clickeo en el boton sumar creo una constante que es igual al id del producto que agregamos al hacer click (el id contiene el nombre, precio, cantidad, etc)...
        // 
        const producto = carrito[html.target.dataset.id]
        producto.cantidad--;

        if (producto.cantidad === 0) { // Para que no exista el -1, -2 etc en cantidad  USO DELETE
            delete carrito[html.target.dataset.id]
        }
        mostrarCarrito();
    }
    html.stopPropagation();
}







