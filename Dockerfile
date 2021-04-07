## -- Base --
#FROM node:14-buster AS base
#WORKDIR /app
#COPY package.json .
#
#RUN apt update -y
#RUN apt install fontconfig build-essential libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev -y
#RUN fc-cache -fv
#
#RUN npm set progress=false && npm config set depth 0
#RUN npm install --only=production
## copy production node_modules aside
#RUN cp -R node_modules prod_node_modules
## install ALL node_modules, including 'devDependencies'
#RUN npm install
#
#
## -- Release --
#FROM node:14-buster AS release
## copy production node_modules
#COPY --from=base /app/prod_node_modules ./node_modules
## copy app sources
#COPY . .
#
#EXPOSE 3003
#CMD [ "node", "app.js" ]
#


# ---- Base Node ----
FROM node:14-buster AS base
WORKDIR /app
RUN apt update -y
RUN apt install fontconfig  -y
RUN fc-cache -fv
COPY package.json .

#
# ---- Dependencies ----
FROM base AS dependencies
# install node packages
RUN npm set progress=false && npm config set depth 0
RUN npm install --only=production
# copy production node_modules aside
RUN cp -R node_modules prod_node_modules
# install ALL node_modules, including 'devDependencies'
RUN npm install


# -- Release --
FROM base AS release
# copy production node_modules
COPY --from=base /app/prod_node_modules ./node_modules
# copy app sources
COPY . .

EXPOSE 3003
CMD [ "node", "app.js" ]
