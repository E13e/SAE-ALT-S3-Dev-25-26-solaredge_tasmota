#!/bin/sh

# Démarrer mosquitto en arrière-plan

ngrok config add-authtoken 38I2v6ai2ZAPwDW2va07vQsmmJJ_2CPYDy7robA6HG9BLsX
mosquitto -c /usr/local/etc/mosquitto/mosquitto.conf -v &

# Démarrer ngrok en arrière-plan

ngrok config add-authtoken 38I2v6ai2ZAPwDW2va07vQsmmJJ_2CPYDy7robA6HG9BLsXNB
ngrok http 3000 &

# Attendre un peu que ngrok démarre
sleep 3

# Démarrer node en premier plan
echo "Starting Node.js app..."
node index.js
