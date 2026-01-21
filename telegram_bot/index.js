import express from "express";
import { Telegraf } from "telegraf";
import mqtt from "mqtt";

// ====== CONFIG ======
const BOT_TOKEN = process.env.BOT_TOKEN;
const PUBLIC_BASE_URL = process.env.PUBLIC_BASE_URL;
const CHANNEL = "-1003532115505";

// ====== TELEGRAM (webhook) ======
const bot = new Telegraf(BOT_TOKEN);
const app = express();
const path = `/tg/${BOT_TOKEN}`; // dev uniquement

// ===== BROKER IUT =====
const MQTT_HOST_IUT = "mqtt.iut-blagnac.fr";
const MQTT_PORT_IUT = 8883;
const MQTT_USERNAME_IUT = process.env.MQTT_USERNAME_IUT;
const MQTT_PASSWORD_IUT = process.env.MQTT_PASSWORD_IUT;
// id du channel -1003532115505

// ===== BROKER LOCAL =====  (config pour mosquitto)
const MQTT_HOST_LOCAL = "172.20.10.5";
const MQTT_PORT_LOCAL = 1883;

const TOPIC_OUT = "cmnd/tasmota_F96BCC/POWER";
const TOPIC_IN = "sandbox/student/SaeSolaredge/etat/consommation";

// ====== CHECKS ======
if (!BOT_TOKEN) throw new Error("BOT_TOKEN manquant");
if (!PUBLIC_BASE_URL) throw new Error("PUBLIC_BASE_URL manquant");
if (!MQTT_USERNAME_IUT || !MQTT_PASSWORD_IUT) throw new Error("MQTT_USERNAME_IUT/MQTT_PASSWORD_IUT manquants");

// ====== MQTT (TLS) ======
const mqttUrl_IUT = `mqtts://${MQTT_HOST_IUT}:${MQTT_PORT_IUT}`;
const mqttClient_IUT = mqtt.connect(mqttUrl_IUT, {
  username: MQTT_USERNAME_IUT,
  password: MQTT_PASSWORD_IUT,
  clientId: `tg-bot-${Math.random().toString(16).slice(2)}`,
});

// ===== Local (mosquitto) =====
const mqttUrl_LOCAL = `mqtt://${MQTT_HOST_LOCAL}:${MQTT_PORT_LOCAL}`;
const mqttClient_LOCAL = mqtt.connect(mqttUrl_LOCAL);

mqttClient_IUT.once("connect", async () => {
  console.log("MQTT IUT connected:", mqttUrl_IUT);

  mqttClient_IUT.subscribe(TOPIC_IN, (err) => {
    if (err) bot.telegram.sendMessage(CHANNEL,"MQTT subscribe error: " + err.message);
    else bot.telegram.sendMessage(CHANNEL, "MQTT subscribed: " + TOPIC_IN);
  });

  }
);

// ===== broker de l'IUT =====
mqttClient_IUT.on("message", async (topic, message) => {
  if (topic === TOPIC_IN) {
    const payload = message.toString();
    const mess = JSON.parse(payload);
    if (mess["surconsommation"] === true) {
      bot.telegram.sendMessage(CHANNEL, "surconsommation, lancement de l'alerte")
      mqttClient_LOCAL.publish(TOPIC_OUT, "OFF");
    } else if (mess["surconsommation"] === false) {
      bot.telegram.sendMessage(CHANNEL, "alerte aquité sur le M5 de la salle, la prise se rallume")
      mqttClient_LOCAL.publish(TOPIC_OUT, "ON");
    }
    bot.telegram.sendMessage(CHANNEL, payload);
}
});

mqttClient_IUT.on("error", (err) => {
  console.error("MQTT error:", err.message);
});

mqttClient_LOCAL.on("message", (topic, message) => {
  if (topic === TOPIC_OUT) {
    const payload = message.toString();
    console.log("MQTT LOCAL:", payload);
  }
})

app.use(bot.webhookCallback(path));

app.listen(3000, async () => {
  const webhookUrl = `${PUBLIC_BASE_URL}${path}`;
  await bot.telegram.setWebhook(webhookUrl);
  console.log("Webhook set to:", webhookUrl);
});
