FROM node:latest

WORKDIR /usr/src/app

COPY . .

RUN yarn install

EXPOSE 8001

CMD ["yarn", "start"]