// Import module
const mqtt       = require("mqtt");
const express    = require("express");
const http       = require("http");
const { Server } = require("socket.io");
const path       = require("path");

// Var MQTT
const broker = "mqtts://mqtt.iut-blagnac.fr:8883";
const options = { username: "student", password: "student" };
const topicData = "energy/solaredge/blagnac/#";
const topicAlert = "sandbox/student/SaeSolaredge/etat/consommation";
const topicSeuil = "sandbox/student/SaeSolaredge/etat/seuil";
const topicConso = "energy/triphaso/by-room/B110/data/#";

// init serveur web et socket pour la comm en direct avec le site
const app = express();
const server = http.createServer(app);
const io = new Server(server);
const historique = {};


app.use(express.static(__dirname));

// Connexion au broker et abonnement aux topics
const mqttClient = mqtt.connect(broker, options);

mqttClient.on("connect", () => {
  console.log("MQTT connecté.");

  // Topic panneaux solaire
  mqttClient.subscribe(topicData, (err) => {
    if (err) console.error(err.message);
    else console.log(`Abonnement à ${topicData} réussi`);
  });

  // Topic Alerte conso
  mqttClient.subscribe(topicAlert, (err) => {
    if (err) console.error(err.message);
    else console.log(`Abonnement à ${topicAlert} réussi`);
  });

  // Topic conso salle
  mqttClient.subscribe(topicConso, (err) => {
    if (err) console.error(err.message);
    else console.log(`Abonnement à ${topicConso} réussi`);
  });


});

// Reception message
mqttClient.on("message", (receivedTopic, message) => {
  try {
    const data = JSON.parse(message.toString());
    io.emit("mqtt_message", { topic: receivedTopic, data });

    // historiqeu
    if (receivedTopic == 'energy/solaredge/blagnac/overview') {
      var test = JSON.stringify(data, null, 2);
      var split = JSON.parse(test);

      const timestamp = new Date().toISOString();
      const puissance = Object.values(split.currentPower)[0];
      
      historique[timestamp] = puissance;
      
      console.log("VALEURS HISTORIQUE : ", historique);
      io.emit("historique", historique);

    }

    // date msg mqtt surconsommation
    if (receivedTopic == topicAlert) {
      const timestampAlert = new Date().toISOString();

      console.log("dernier changement etat surconso : ", timestampAlert);
      io.emit("timestampAlert", timestampAlert);
    }

    

    console.log(`Message reçu et broadcasté: ${receivedTopic}`);
    console.log(`Message reçu : ${receivedTopic}`);
    console.log(data, "\n")
  } catch (e) {
    console.error("Erreur JSON :", e.message);
  }
});


// Erreur
mqttClient.on("error", (err) => {
  console.error("Erreur MQTT :", err.message);
});

io.on('connection', (socket) => {
  socket.on('changement_seuil', (nouveauSeuil) => {

    console.log(nouveauSeuil);

    var preparation = { "seuil" : nouveauSeuil };
    var seuilSousFormeJson = JSON.stringify(preparation);

    mqttClient.publish(topicSeuil, seuilSousFormeJson);

  })
 
});
const PORT = 80;
server.listen(PORT, () => {
  console.log(`Serveur HTTP/WebSocket sur http://localhost:${PORT}`);
});
