FROM node:6.11.4-alpine

RUN mkdir -p /usr/src/app/api
WORKDIR /usr/src/app

ARG NODE_ENV
ENV NODE_ENV $NODE_ENV

# Install the globabl pm2 process manager
RUN yarn global add pm2@2.4.6 -g

# First just copy over the yarn files (multi-stage build optimization)
# Frontend yarn files
COPY ./package.json /usr/src/app
COPY ./yarn.lock /usr/src/app
# API yarn files
COPY ./api/localDependencies /usr/src/app/api/localDependencies
COPY ./api/package.json /usr/src/app/api
COPY ./api/yarn.lock /usr/src/app/api

# Then install the dependencies using yarn/npm
# Frontend dependencies
RUN yarn install
RUN npm rebuild node-sass
# API dependencies
WORKDIR /usr/src/app/api
RUN yarn install
WORKDIR /usr/src/app

# Copy over the rest of the files
COPY . /usr/src/app
# Build the frontend app
RUN yarn run build
# Clean up a bit
RUN yarn cache clean

# Expose the api server port and the app server port
EXPOSE 3001
EXPOSE 9000

# Run using the node user (otherwise runs as root, which is security risk)
USER node

CMD [ "pm2-docker", "pm2.config.js" ]