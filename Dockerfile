FROM node:12.14.0-buster-slim
WORKDIR /app
COPY . .
RUN npm ci
EXPOSE 3003
CMD [ "node", "app.js" ]