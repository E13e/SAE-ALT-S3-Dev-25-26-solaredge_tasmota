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
const topicAlert = "sandbox/student/SaeSolaredge/etat/alerte"
const topicConso = "energy/triphaso/by-room/B110/data/#"

// init serveur web et socket pour la comm en direct avec le site
const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.join(__dirname, "web")));


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


const PORT = 80; 
server.listen(PORT, () => {
  console.log(`Serveur HTTP/WebSocket sur http://localhost:${PORT}`);
});
