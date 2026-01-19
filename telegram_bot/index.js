import express from "express";
import { Telegraf } from "telegraf";
import mqtt from "mqtt";

// ====== CONFIG ======
const BOT_TOKEN = process.env.BOT_TOKEN; // NE PAS hardcoder
const PUBLIC_BASE_URL = process.env.PUBLIC_BASE_URL;

const MQTT_HOST = "mqtt.iut-blagnac.fr";
const MQTT_PORT = 8883;
const MQTT_USERNAME = process.env.MQTT_USERNAME;
const MQTT_PASSWORD = process.env.MQTT_PASSWORD;
//let TELEGRAM_CHAT_ID = /*Number(process.env.TELEGRAM_CHAT_ID)*/0;

const TOPIC_OUT = "sandbox/student/SaeSolaredge/etat/bot";
const TOPIC_IN = "sandbox/student/SaeSolaredge/etat";

// ====== CHECKS ======
if (!BOT_TOKEN) throw new Error("BOT_TOKEN manquant");
if (!PUBLIC_BASE_URL) throw new Error("PUBLIC_BASE_URL manquant");
if (!MQTT_USERNAME || !MQTT_PASSWORD) throw new Error("MQTT_USERNAME/MQTT_PASSWORD manquants");

// ====== MQTT (TLS) ======
const mqttUrl = `mqtts://${MQTT_HOST}:${MQTT_PORT}`;
const mqttClient = mqtt.connect(mqttUrl, {
  username: MQTT_USERNAME,
  password: MQTT_PASSWORD,
  clientId: `tg-bot-${Math.random().toString(16).slice(2)}`,
  // Si le broker a un certificat non reconnu par ton OS, ajoute temporairement:
  // rejectUnauthorized: false,
});

mqttClient.once("connect", async () => {
  console.log("MQTT connected:", mqttUrl);

  mqttClient.subscribe(TOPIC_IN, (err) => {
    if (err) console.error("MQTT subscribe error:", err.message);
    else console.log("MQTT subscribed:", TOPIC_IN);
  });

    const CHANNEL = "@solaredge_iut_alertes";
    await bot.telegram.sendMessage("@solaredge_iut_alertes", "test");
  }
);

mqttClient.on("message", async (topic, message) => {
  if (topic === TOPIC_IN) {
    const payload = message.toString();
    const mess = JSON.parse(payload);
    // appeler ici getValeur(payload);
    if (mess["surconsomation"] == true) {
        console.log("Il y a une surconsommation ⚠️");
    }
    // publier un message sur l'autre broker
    console.log(`MQTT message on ${topic}:`, payload);

}
});

mqttClient.on("error", (err) => {
  console.error("MQTT error:", err.message);
});

// ====== TELEGRAM (webhook) ======
const bot = new Telegraf(BOT_TOKEN);
const app = express();

const path = `/tg/${BOT_TOKEN}`; // dev uniquement

bot.on("text", async (ctx) => {
  const text = ctx.message.text;

  mqttClient.publish(TOPIC_OUT, text);
  await ctx.reply("Envoyé sur MQTT ✅");
  // !!!! regarder ca ca fonctionne pas !!!!
//   TELEGRAM_CHAT_ID = ctx.chat.id;
//   console.log("CHAT_ID =", chatId);
//   return ctx.reply(`Ton chatId est: ${chatId}`);
});

// bot.start((ctx) => {
//   const chatId = ctx.chat.id;
//   console.log("CHAT_ID =", chatId);
//   return ctx.reply(`Ton chatId est: ${chatId}`);
// //   5325556851
// });

app.use(bot.webhookCallback(path));

app.listen(3000, async () => {
  const webhookUrl = `${PUBLIC_BASE_URL}${path}`;
  await bot.telegram.setWebhook(webhookUrl);
  console.log("Webhook set to:", webhookUrl);
});
