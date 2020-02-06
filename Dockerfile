FROM node:12.14.0-buster-slim
WORKDIR /app
COPY app.js app.js
COPY template.png template.png
COPY package.json package.json
COPY package-lock.json package-lock.json
COPY assets/Ubuntu-Regular.ttf assets/Ubuntu-Regular.ttf
RUN npm ci
EXPOSE 3003
CMD [ "node", "app.js" ]