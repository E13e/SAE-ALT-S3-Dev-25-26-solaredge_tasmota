FROM node:20-alpine

WORKDIR /web

RUN npm install mqtt express socket.io

COPY ./index.js /bot_telegram/index.js
COPY . /bot_telegram

EXPOSE 80
CMD [ "node", "index.js" ]
