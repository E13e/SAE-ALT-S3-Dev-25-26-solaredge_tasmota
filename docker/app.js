const mqtt = require("mqtt");
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

const broker = "mqtts://mqtt.iut-blagnac.fr:8883";
const options = { username: "student", password: "student" };
const topicData = "energy/solaredge/blagnac/#";
const topicAlert = "sandbox/student/SaeSolaredge/etat/alerte"

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.join(__dirname, "web")));

const mqttClient = mqtt.connect(broker, options);

mqttClient.on("connect", () => {
  console.log("MQTT connecté.");
  
  mqttClient.subscribe(topicData, (err) => {
    if (err) console.error(err.message);
    else console.log(`Abonnement à ${topicData} réussi`);
  });
  mqttClient.subscribe(topicAlert, (err) => {
    if (err) console.error(err.message);
    else console.log(`Abonnement à ${topicAlert} réussi`);
  });

});

mqttClient.on("message", (receivedTopic, message) => {
  try {
    const data = JSON.parse(message.toString());
    io.emit("mqtt_message", { topic: receivedTopic, data });
    console.log(`Message reçu et broadcasté: ${receivedTopic}`);
  } catch (e) {
    console.error("Erreur JSON :", e.message);
  }
});

mqttClient.on("error", (err) => {
  console.error("Erreur MQTT :", err.message);
});

const PORT = 80; 
server.listen(PORT, () => {
  console.log(`Serveur HTTP/WebSocket sur http://localhost:${PORT}`);
});
