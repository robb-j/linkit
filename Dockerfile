FROM node:9-alpine

WORKDIR /app

COPY package.json /app

RUN npm install -s --production

COPY web /app/web

CMD [ "npm", "start" ]
