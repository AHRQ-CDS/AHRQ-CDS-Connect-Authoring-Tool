FROM node:6.10.3

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

ARG NODE_ENV
ENV NODE_ENV $NODE_ENV
COPY . /usr/src/app
RUN yarn install && yarn cache clean
RUN yarn run build
RUN yarn global add pm2@2.4.6 -g

EXPOSE 3001
EXPOSE 9000
CMD [ "pm2-docker", "pm2.config.js" ]