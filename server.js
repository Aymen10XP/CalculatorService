const soap = require('soap');
const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 8000;
// Implémentation des opérations du service
const calculatorService = {
 CalculatorService: {
 CalculatorPort: {
 // Opération Addition
 Add: function(args) {
 const result = parseFloat(args.a) + parseFloat(args.b);
 console.log(`Add: ${args.a} + ${args.b} = ${result}`);
 return { result: result };
 },

 // Opération Soustraction
 Subtract: function(args) {
 const result = parseFloat(args.a) - parseFloat(args.b);
 console.log(`Subtract: ${args.a} - ${args.b} = ${result}`);
 return { result: result };
 },

 // Opération Multiplication
 Multiply: function(args) {
 const result = parseFloat(args.a) * parseFloat(args.b);
 console.log(`Multiply: ${args.a} * ${args.b} = ${result}`);
 return { result: result };
 },

 // Opération Division
 Divide: function(args) {
 if (parseFloat(args.b) === 0) {
 throw {
 Fault: {
 Code: { Value: 'DIVIDE_BY_ZERO' },
 Reason: { Text: 'Division par zéro impossible' }
 }
 };
 }
 const result = parseFloat(args.a) / parseFloat(args.b);
 console.log(`Divide: ${args.a} / ${args.b} = ${result}`);
 return { result: result };
 },

// Opération Modulo 
 Modulo: function(args) {
 if (parseFloat(args.b) === 0) {
 throw {
 Fault: {
 Code: { Value: 'DIVIDE_BY_ZERO' },
 Reason: { Text: 'Division par zéro impossible' }
 }
 };
 }
 const result = parseFloat(args.a) % parseFloat(args.b);
 console.log(`Modulo: ${args.a} % ${args.b} = ${result}`);
 return { result: result };
 },

 // Opération Power
 Power: function(args) {
 if (parseFloat(args.b) < 0) {
 throw {
 Fault: {
 Code: { Value: 'Negative power error' },
 Reason: { Text: 'Power with negative exponent not allowed' }
 }
 };
 }
 const result = Math.pow(parseFloat(args.a), parseFloat(args.b));
 console.log(`Power: ${args.a} ^ ${args.b} = ${result}`);
 return { result: result };
 }




 }
 }

 };

 const temperatureService = {
    TemperatureService: {
        TemperaturePort: {
            CelsiusToFahrenheit: function(args) {
                const f = parseFloat(args.value) * 9/5 + 32;
                return { result: f.toFixed(2) };
            },
            FahrenheitToCelsius: function(args) {
                const c = (parseFloat(args.value) - 32) * 5/9;
                return { result: c.toFixed(2) };
            },
            CelsiusToKelvin: function(args) {
                const k = parseFloat(args.value) + 273.15;
                return { result: k.toFixed(2) };
            }
        }
    }
};



// Lire le fichier WSDL
const wsdlPath = path.join(__dirname, 'calculator.wsdl');
const wsdl = fs.readFileSync(wsdlPath, 'utf8');


const wsdl2 = fs.readFileSync(path.join(__dirname, 'temperature.wsdl'), 'utf8');

app.listen(PORT, () => {
    soap.listen(app, '/temperature', temperatureService, wsdl);
    console.log(`🚀 Service de Température sur http://localhost:${PORT}/temperature?wsdl`);
});


/*
// Démarrer le serveur
app.listen(PORT, function() {
 console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);

 // Créer le service SOAP
 //const server = soap.listen(app, '/calculator', calculatorService, wsdl);
 const serverT = soap.listen(app, '/temperature', temperatureService, wsdl2);

 //console.log(`🚀 WSDL Calculator disponible sur http://localhost:${PORT}/calculator?wsdl`);
 console.log(`🚀 WSDL Temperature disponible sur http://localhost:${PORT}/temperature?wsdl`);

 // Log des requêtes entrantes (debug)
 server.log = function(type, data) {
 console.log(`[${type}]`, data);
 };
});*/
