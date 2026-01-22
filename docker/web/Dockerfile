FROM node:20-alpine

WORKDIR /web

RUN npm install mqtt express socket.io

COPY ./app.js /web/app.js
COPY . /web

EXPOSE 3000
CMD [ "ngrok", "http", "3000" ]
CMD [ "export", "MQTT_USERNAME_IUT='student'" ]
CMD [ "export", "MQTT_PASSWORD_IUT='student'" ]
CMD [ "export", "BOT_TOKEN='8500238669:AAF35Ny4T50gsD__YeUjkoCGs5TLOm5vEuY'" ]
CMD [ "export", "MQTT_USERNAME_IUT='student'" ]
CMD [ "export", "MQTT_PASSWORD_IUT='student'" ]
CMD [ "export", "BOT_TOKEN='8500238669:AAF35Ny4T50gsD__YeUjkoCGs5TLOm5vEuY'" ]
CMD [ "export", "PUBLIC_BASE_URL='https://balmy-weston-unrotary.ngrok-free.dev'" ]
CMD [ "node", "app.js" ]
