FROM node:8.9.1-alpine

ARG NODE_ENV
ENV NODE_ENV $NODE_ENV

# Install the globabl pm2 process manager
RUN yarn global add pm2@2.7.2 -g

# First copy over the yarn files and install dependencies (multi-stage build optimization)

# Frontend
RUN mkdir -p /usr/src/app/frontend
WORKDIR /usr/src/app/frontend
COPY ./frontend/package.json .
COPY ./frontend/yarn.lock .
RUN yarn install
RUN npm rebuild node-sass

# API
RUN mkdir -p /usr/src/app/api
WORKDIR /usr/src/app/api
COPY ./api/localDependencies ./localDependencies
COPY ./api/package.json .
COPY ./api/yarn.lock .
RUN yarn install

# Now copy over the remaining files and build as necessary

#Frontend
WORKDIR /usr/src/app/frontend
COPY ./frontend /usr/src/app/frontend
RUN yarn build

# API
COPY ./api /usr/src/app/api

# PM2 Config
COPY ./pm2.config.js /usr/src/app

# Clean up a bit to save space
RUN yarn cache clean

# Expose the api server port and the app server port
EXPOSE 3001
EXPOSE 9000

# Run using the node user (otherwise runs as root, which is security risk)
USER node

WORKDIR /usr/src/app
CMD [ "pm2-docker", "pm2.config.js" ]