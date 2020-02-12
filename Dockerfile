FROM node:12.14.0-buster-slim
WORKDIR /app
COPY app.js app.js
COPY assets/ assets/
COPY package.json package.json
COPY package-lock.json package-lock.json
RUN npm ci
EXPOSE 3003
CMD [ "node", "app.js" ]
