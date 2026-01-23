FROM node:20-alpine

WORKDIR /bot_telegram

RUN apk add --no-cache mosquitto mosquitto-clients curl tar

RUN npm install mqtt express telegraf

RUN curl -sL https://bin.equinox.io/c/bNyj1mQVY4c/ngrok-v3-stable-linux-amd64.tgz \
    -o ngrok.tgz \
    && tar -xzf ngrok.tgz -C /usr/local/bin \
    && rm ngrok.tgz \
    && chmod +x /usr/local/bin/ngrok

RUN mkdir -p /usr/local/etc/mosquitto

COPY mosquitto-hotspot.conf /usr/local/etc/mosquitto/mosquitto.conf

COPY ./index.js /bot_telegram/index.js
COPY . .

ENV MQTT_USERNAME_IUT="student"
ENV MQTT_PASSWORD_IUT="student"
ENV BOT_TOKEN="8500238669:AAF35Ny4T50gsD__YeUjkoCGs5TLOm5vEuY"
ENV PUBLIC_BASE_URL="https://balmy-weston-unrotary.ngrok-free.dev"


CMD [ "./start.sh" ]
