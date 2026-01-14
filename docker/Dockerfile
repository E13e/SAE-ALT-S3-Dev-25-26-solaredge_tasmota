FROM node:20-alpine

WORKDIR /app

RUN npm install mqtt express socket.io

COPY ./app.js /app/app.js
COPY ./web /app/web

EXPOSE 80
CMD [ "node", "app.js" ]
