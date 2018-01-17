FROM node:9-alpine

WORKDIR /app

EXPOSE 3000

VOLUME /app/logs

COPY package.json /app

RUN npm install -s --production

COPY web /app/web

CMD [ "npm", "start" ]
