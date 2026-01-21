FROM node:20-alpine

WORKDIR /bot_telegram

RUN npm install mqtt express telegraf

COPY ./index.js /bot_telegram/index.js
COPY . /bot_telegram

CMD [ "node", "index.js" ]
