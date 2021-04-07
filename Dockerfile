FROM node:14-buster
WORKDIR /app

RUN apt update -y
RUN apt install fontconfig build-essential libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev
RUN fc-cache -fv

COPY package.json package.json
COPY package-lock.json package-lock.json
RUN npm ci

COPY assets/images assets/images
COPY assets/fonts /usr/local/share/fonts/

COPY app.js app.js

EXPOSE 3003
CMD [ "node", "app.js" ]
