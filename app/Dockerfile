FROM node:10.16.3

WORKDIR /home/node/app

RUN apt-get update && apt-get install -y git

COPY package.json .
RUN npm install

COPY . .

USER node
