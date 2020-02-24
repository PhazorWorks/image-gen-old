FROM node:12.14.0-buster-slim
WORKDIR /app

RUN apt update -y
RUN apt install fontconfig -y
RUN fc-cache -fv

COPY assets/images assets/images
COPY assets/fonts /usr/local/share/fonts/
COPY package.json package.json
COPY package-lock.json package-lock.json
RUN npm ci

COPY app.js app.js

EXPOSE 3003
CMD [ "node", "app.js" ]
