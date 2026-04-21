const soap = require('soap');
const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 8001;

// 1. L'implémentation (Logique métier)
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

// 2. Chargement du WSDL
const wsdlPath = path.join(__dirname, 'temperature.wsdl');
if (!fs.existsSync(wsdlPath)) {
    console.error(" Erreur : Le fichier temperature.wsdl est introuvable dans le dossier !");
    process.exit(1);
}
const wsdl = fs.readFileSync(wsdlPath, 'utf8');

// 3. Démarrage du serveur
app.listen(PORT, async () => {
    console.log(` Serveur démarré sur http://localhost:${PORT}`);
    
    // Créer l'écouteur SOAP
    soap.listen(app, '/temperature', temperatureService, wsdl);
    console.log(` WSDL disponible sur http://localhost:${PORT}/temperature?wsdl`);

    // --- 4. TEST AUTOMATIQUE (Le code du client est ici maintenant) ---
    console.log('\n--- Lancement des tests clients ---\n');
    try {
        const url = `http://localhost:${PORT}/temperature?wsdl`;
        const client = await soap.createClientAsync(url);
        
        const [resF] = await client.CelsiusToFahrenheitAsync({ value: 20 });
        console.log(` Test 20°C en Fahrenheit : ${resF.result}°F`);

        const [resK] = await client.CelsiusToKelvinAsync({ value: 0 });
        console.log(` Test 0°C en Kelvin : ${resK.result}K`);

    } catch (testError) {
        console.error(" Erreur lors du test client :", testError.message);
    }
});