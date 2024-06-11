# OVERVIEW: This is the Dockerfile for a multi-stage build of the CDS Authoring
# Tool. A multi-stage approach was used to keep the overall image size low by
# including only the layers needed at runtime in the final image. For more
# info see: https://docs.docker.com/develop/develop-images/multistage-build/

###############################################################################
# STAGE 0: base
# - Setup base image from which most others derive. This allows for a single
#   place to declare the versioned node image we use and any other commands
#   common to all (or most?) environments.
###############################################################################

FROM node:18-alpine as base

ENV NODE_ENV production

###############################################################################
# STAGE 1: install_backend
# - Install production dependencies for the api project
# - Copy over api source code
###############################################################################

FROM base as install_backend

# First copy just the package.json, package-lock.json, and local dependencies
# so that if they have not changed, we can use cached node_modules instead of
# redownloading them all.
COPY ./api/package.json /usr/src/app/api/package.json
COPY ./api/package-lock.json /usr/src/app/api/package-lock.json
WORKDIR /usr/src/app/api
RUN npm install

# Then copy the rest of the source code
COPY ./api /usr/src/app/api

###############################################################################
# STAGE 2: install_frontend
# - Install packages needed by npm install (python2, make, g++)
# - Install production dependencies for the frontend project
# - Copy over frontend source code
###############################################################################

FROM base as install_frontend

# First copy just the package.json and package-lock.json so that if they have
# not changed, we can use cached node_modules instead of redownloading them all.
COPY ./frontend/package.json /usr/src/app/frontend/package.json
COPY ./frontend/package-lock.json /usr/src/app/frontend/package-lock.json
WORKDIR /usr/src/app/frontend
RUN npm install

# Then copy the rest of the source code
COPY ./frontend /usr/src/app/frontend

###############################################################################
# STAGE 3: build_frontend
# - Build frontend code to produce standard html, js, and css files
###############################################################################

FROM install_frontend as build_frontend

WORKDIR /usr/src/app/frontend

# Install the development dependencies since they're needed by "npm run build"
ENV NODE_ENV development
RUN npm install

# Switch back to production for the actual build
ENV NODE_ENV production
RUN npm run build

###############################################################################
# STAGE 4: final
# - Setup NODE_ENV as an argument
# - Install PM2 process manager
# - Copy over all files needed at run-time
# - Expose necessary ports
# - Run as node (more secure than running as root)
###############################################################################

FROM base as final

ARG NODE_ENV
ENV NODE_ENV $NODE_ENV

RUN npm install -g pm2@5.3.0

COPY --chown=node:node --from=install_backend /usr/src/app/api /usr/src/app/api
COPY --chown=node:node --from=install_frontend /usr/src/app/frontend/node_modules /usr/src/app/frontend/node_modules
COPY --chown=node:node --from=build_frontend /usr/src/app/frontend/build /usr/src/app/frontend/build
COPY --chown=node:node ./frontend/src/data /usr/src/app/frontend/src/data
COPY --chown=node:node ./frontend/.env* /usr/src/app/frontend/
COPY --chown=node:node ./frontend/server.js /usr/src/app/frontend/
COPY --chown=node:node ./pm2.config.js /usr/src/app/

EXPOSE 3001
EXPOSE 9000

USER node

WORKDIR /usr/src/app
CMD [ "pm2-docker", "pm2.config.js" ]
