FROM node:6.11.4-alpine

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

ARG NODE_ENV
ENV NODE_ENV $NODE_ENV

# First just copy over things necessary for yarn install (multi-stage build optimization)
COPY ./localDependencies /usr/src/app/localDependencies
COPY ./package.json /usr/src/app
COPY ./yarn.lock /usr/src/app
RUN yarn global add pm2@2.4.6 -g
RUN yarn install && yarn cache clean
RUN npm rebuild node-sass

# Now copy over the rest and build the app
COPY . /usr/src/app
RUN yarn run build

# Expose the api server port and the app server port
EXPOSE 3001
EXPOSE 9000

# Run using the node user (otherwise runs as root, which is security risk)
USER node

CMD [ "pm2-docker", "pm2.config.js" ]