// Este es un simulador de retenciones de ganancias, busca que el usuario ingrese el tipo de retencion, con una pequeña
// descripción, ingrese el importe sobre el que quiere realizar el calculo correspondiente


// El html no se muestra completo al principio teniendo que confimar si desean realizar retenciones 
// antes de ver la pantalla para el calculo. 

// Variables para confirmar que desea realizar calculo

const display = document.getElementById("confirmarDisplay")
const ndisplay = document.getElementById("cancelarDisplay")

// Funciones para mostrar u ocultar los contenedores 

function ocultarContenedor (){
    document.getElementById("contenedor-retenciones").style.display = "none";
}

function mostrarContenedor (){
    document.getElementById("contenedor-retenciones").style.display ="block";
}

function ocultarContconfirmacion(){
    document.getElementById("contenedor-confirmacion").style.display ="none";
    document.getElementById("contenedor-saludo").style.display ="none";
}

function mostrarContenedorTipo (){
    document.getElementById("contenedor-tipo").style.display ="block";
    document.getElementById("contenedor-calculo").style.display ="block";
}

function ocultarContenedorTipo (){
    document.getElementById("contenedor-tipo").style.display ="none";
}
function mostrarContenedorCalculo (){
    document.getElementById("contenedor-calculo").style.display ="block";
    document.getElementById("contenedor-tipo").style.display ="none"
}
function ocultarContenedorCalculo (){
    document.getElementById("contenedor-calculo").style.display ="none";
}

function ocultarContenedorResultado (){
    document.getElementById("contenedor-resultado").style.display ="none";
}

function mostrarContenedorResultado (){
    document.getElementById("contenedor-resultado").style.display ="block";
}

// Ejecución por defecto de la funcion de ocultar el contenedor de retenciones

ocultarContenedor()

// Acciones al hacer click en los botones confirmar y cancelar utilizando
// funciones anonimas

display.addEventListener("click", () =>{
    mostrarContenedor()
    ocultarContconfirmacion()
    ocultarContenedorCalculo()
    })
ndisplay.addEventListener("click", () =>{
    ocultarContenedor()
})

// Mediante una plantilla generada a traves de clases se trabaja sobre la informacion contenida en el array retencionTipo
// y el array datos en el que guardaremos la informacion que luego estara contenida en el storage

const datos = []
const retencionesTipo = []
const contenedorTipo = document.getElementById(`contenedor-tipo`)

class Dato{
    static minimoGral = 240
    constructor(codigo,nombre,netogravado,resultado,minimo,porcentaje){ 
    this.minimo= minimo;
    this.porcentaje = porcentaje;
    this.codigo = codigo;
    this.nombre = nombre;
    this.netogravado = netogravado;
    this.resultado = resultado;
    }
    agregarinfo(id,valor){
        this[id] = valor
    }
    agregarvalor(id,valor){
        this[id] = valor
    }
    calculoret(){
        if(this.minimo<this.netogravado){
        const resultado = `es ${(this.netogravado-this.minimo)*this.porcentaje}`;
        document.getElementById("resultado").textContent = resultado;
        datos.push(new Dato(this.codigo,this.nombre,this.netogravado,resultado))
        guardarvalor()
        return resultado
        }    
        else{
        const resultado = `no corresponde`    
        document.getElementById("resultado").textContent = resultado;
        datos.push(new Dato(this.codigo,this.nombre,this.netogravado,resultado))
        guardarvalor()
        return resultado
        }
    }
}

const nuevoDato = new Dato()

// Acciones para agregar la informacion proporcionada en el input y realizar el correspondiente calculo
function agregarneto(even){
    const neto = document.getElementById("netoGravado");
    const netogravado= neto.value
    nuevoDato.agregarvalor(`netogravado`,netogravado)
}

function calcular(e){
    document.getElementById("resultado").textContent = nuevoDato.calculoret();
    mostrarContenedorTipo()
}   

// En esta parte incorparamos la informacion al storagelocal
function guardarvalor(){
    const resultadosJSON = JSON.stringify(datos)
    localStorage.setItem("datos",resultadosJSON)
}

// Aqui se incorporaron las funciones que deben cumplir los botones al elegir el tipo de retencion

const btnCalcular = document.querySelectorAll(`.btn-calculo`)

btnCalcular.forEach(el =>{
    el.addEventListener(`click`, (e) =>{
        calcular(e);
        mostrarContenedorResultado ()
    })
})

const btnNeto = document.querySelectorAll(`.btn-neto`)

btnNeto.forEach(el =>{
    el.addEventListener(`click`, (even) =>{
        agregarneto(even)
    })
})


// En esta parte se muestra el resultado producto del calculo de la retencion

const contenedorResultado = document.getElementById(`contenedor-resultado`)

const ret = document.createElement(`div`);

ret.innerHTML =(`
                <h4>La retención <span id="resultado"></span></h4>
            `);
contenedorResultado.appendChild(ret)

// Trayendo informacion externa con funcion asincronicas

async function traerDatos(){
    try{
        const url = `retenciones.json`
        const response = await fetch(url)
        const datosfinales = await response.json();
        const retencionesTipo = JSON.parse(JSON.stringify([...datosfinales]))

    
        // Con este for se seleccionan los tipos de retenciones definidas en el array retencionesTipo
        for(const retencionTipo of retencionesTipo){
            const codigoTipo = document.createElement(`div`);
            codigoTipo.innerHTML =(`
                                    <ul >
                                        <li><button type="button" data-indice=${retencionTipo.codigo} class="btnSelector" data-nombre= ${retencionTipo.nombre} 
                                        data-porcentaje= ${retencionTipo.porcentaje} data-minimo= ${retencionTipo.minimo}> ${retencionTipo.codigo} 
                                        - ${retencionTipo.nombre}</button></li>
                                    </ul>
                                `);
            contenedorTipo.appendChild(codigoTipo);
        }    
        // Aqui se incorporaron las funciones que deben cumplir el boton que selecciona el tipo de retención

        const btnSelector  = document.querySelectorAll(`.btnSelector`)

        btnSelector.forEach(el =>{
            el.addEventListener(`click`, (event) =>{
                seleccionarDato(event);
                mostrarContenedorCalculo();
                ocultarContenedorResultado();
            })
        })

        // Acciones para seleccionar el tipo de retenciones que se van a utilizar

        function seleccionarDato(event){

            // Define las acciones que se llevaran a cabo al hacer click
            const codigo = parseInt(event.target.getAttribute('data-indice'));
            const porcentaje = parseFloat(event.target.getAttribute('data-porcentaje'));
            const minimo = parseFloat(event.target.getAttribute('data-minimo'));
            const nombre = event.target.getAttribute('data-nombre');
        
            // Agrega la inforacion a la clase
            nuevoDato.agregarinfo(`codigo`,codigo)
            nuevoDato.agregarinfo(`porcentaje`,porcentaje)
            nuevoDato.agregarinfo(`minimo`,minimo)
            nuevoDato.agregarinfo(`nombre`,nombre)
            nuevoDato.netogravado=0
            
            // Mostrar la información del producto en la página
            document.getElementById("resultado").textContent = 0;
            
        }
    } catch(error) {
        console.warn("Hubo un error al realizar el fetch:", error)
    }
}
traerDatos()

// En esta parte utilizamos la libreria sweet alert 2 para incorporar ciertos avisos

const btnSwal = document.getElementById("btnSwal")

btnSwal.addEventListener("click", ()=>{
    Swal.fire("Ingresaste al simulador");
});

const btnSwal2 = document.getElementById("btnSwal2")

btnSwal2.addEventListener("click", ()=>{
    Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Agregaste en neto exitosamente",
        showConfirmButton: false,
        timer: 1500
      });
});  
