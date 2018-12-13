# Use a node alpine image install packages and run the start script
FROM node:10-alpine
WORKDIR /app
VOLUME /app/logs
EXPOSE 3000
COPY ["package.json", "package-lock.json", "/app/"]
ENV NODE_ENV production
RUN npm ci > /dev/null
COPY web /app/web
CMD [ "npm", "start", "-s" ]