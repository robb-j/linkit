# Use a node alpine image install packages and run the start script
FROM node:12-alpine
WORKDIR /app
EXPOSE 3000
ENV NODE_ENV production
COPY ["package*.json", "/app/"]
RUN npm ci && npm cache clean --force
COPY src /app/src
CMD [ "node", "src/index.js" ]
