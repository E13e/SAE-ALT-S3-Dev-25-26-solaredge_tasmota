FROM node:20-alpine

WORKDIR /web

RUN npm install mqtt express socket.io

COPY ./app.js /web/app.js
COPY . /web

EXPOSE 80
CMD [ "node", "app.js" ]
