class Envio {
    constructor(nombre, flete, impuestos) {
        this.nombre = nombre;
        this.flete = flete;
        this.impuestos = impuestos;
        this.totalEnvio = 0;
    }

    calcularTotal() {
        this.totalEnvio = this.flete + this.impuestos;
    }

    getDatosEnvio() {
        return {
            nombre: this.nombre,
            flete: this.flete,
            impuestos: this.impuestos,
            totalEnvio: this.totalEnvio
        };
    }
}

function calcularFlete(peso) {
    if (peso <= 10000) {
        return { tipo: 'Avión', costo: peso * 0.02 };
    } else if (peso >= 10001 && peso < 50001) {
        return { tipo: 'Barco', costo: peso * 0.015 };
    } else {
        return { tipo: 'No válido', costo: 0 };
    }
}

function calcularImpuestos(precio) {
    if (precio <= 200) {
        return 0;
    } else if (precio >= 201 && precio <= 5000) {
        return precio * 0.10;
    } else if (precio >= 5001 && precio <= 9999) {
        return precio * 0.20;
    } else {
        return 0;
    }
}

function guardarEnvioEnHistorial(envio) {
    let historial = JSON.parse(localStorage.getItem('historialEnvios')) || [];
    historial.push(envio);
    localStorage.setItem('historialEnvios', JSON.stringify(historial));
}

function mostrarHistorial() {
    let historial = JSON.parse(localStorage.getItem('historialEnvios')) || [];
    let listaHistorial = document.getElementById('mostrarHistorial');
    listaHistorial.innerHTML = '';

    historial.forEach(envio => {
        let listItem = document.createElement('li');
        listItem.classList.add('list-group-item');
        listItem.textContent = `Nombre: ${envio.nombre}, Tipo de envío: ${envio.tipo}, Flete: $${envio.flete.toFixed(2)}, Impuestos: $${envio.impuestos.toFixed(2)}, Total: $${envio.totalEnvio.toFixed(2)}`;
        listaHistorial.appendChild(listItem);
    });
}


document.addEventListener('DOMContentLoaded', function() {
    fetch('https://v6.exchangerate-api.com/v6/30745446bcd695edf96242b4/latest/USD')
        .then(response => response.json())
        .then(data => {
            console.log(data); 
            let copRate = data.conversion_rates.COP;
            let uyuRate = data.conversion_rates.UYU;
            let arsRate = data.conversion_rates.ARS;


            document.getElementById('usd-to-cop').textContent = copRate.toFixed(2);
            document.getElementById('usd-to-uyu').textContent = uyuRate.toFixed(2);
            document.getElementById('usd-to-ars').textContent = arsRate.toFixed(2);
        })
        .catch(error => {
            console.error('Error fetching exchange rates:', error);
            document.getElementById('usd-to-cop').textContent = 'Error';
            document.getElementById('usd-to-uyu').textContent = 'Error';
            document.getElementById('usd-to-ars').textContent = 'Error';
        });
});





document.addEventListener('DOMContentLoaded', mostrarHistorial);


document.querySelector('form').addEventListener('submit', function(event) {
    event.preventDefault(); //


    let nombre = document.getElementById('nombre').value;
    let pesoGramos = parseFloat(document.getElementById('pesoGramos').value);
    let costoProducto = parseFloat(document.getElementById('costoProducto').value);

    let resultadoFlete = calcularFlete(pesoGramos);
    let resultadoImpuestos = calcularImpuestos(costoProducto);


    let objEnvio = new Envio(nombre, resultadoFlete.costo, resultadoImpuestos);
    objEnvio.calcularTotal();

    let envioDatos = objEnvio.getDatosEnvio();
    envioDatos.tipo = resultadoFlete.tipo;
    guardarEnvioEnHistorial(envioDatos);


    Swal.fire({
        title: "Envío calculado",
        html: `
            <p>Estimado ${nombre},</p>
            <p>Tipo de envío: ${resultadoFlete.tipo}</p>
            <p>Costo de impuestos: $${resultadoImpuestos.toFixed(2)}</p>
            <p>Total: $${objEnvio.totalEnvio.toFixed(2)}</p>
            <p>Gracias por usar nuestros servicios.</p>
        `,
        icon: "success"
    }).then(() => {

        document.querySelector('form').reset();


        document.getElementById('tipoEnvioPlaceholder').textContent = '-';
        document.getElementById('costoFletePlaceholder').textContent = '-';
        document.getElementById('costoImpuestosPlaceholder').textContent = '-';


        mostrarHistorial();
    });
});


document.getElementById('pesoGramos').addEventListener('input', function() {
    let pesoGramos = parseFloat(this.value);
    if (!isNaN(pesoGramos)) {
        let resultadoFlete = calcularFlete(pesoGramos);
        document.getElementById('tipoEnvioPlaceholder').textContent = resultadoFlete.tipo;
        document.getElementById('costoFletePlaceholder').textContent = `$${resultadoFlete.costo.toFixed(2)}`;
    } else {
        document.getElementById('tipoEnvioPlaceholder').textContent = '-';
        document.getElementById('costoFletePlaceholder').textContent = '-';
    }
});

document.getElementById('costoProducto').addEventListener('input', function() {
    let costoProducto = parseFloat(this.value);
    if (!isNaN(costoProducto)) {
        let resultadoImpuestos = calcularImpuestos(costoProducto);
        document.getElementById('costoImpuestosPlaceholder').textContent = `$${resultadoImpuestos.toFixed(2)}`;
    } else {
        document.getElementById('costoImpuestosPlaceholder').textContent = '-';
    }
    }); 