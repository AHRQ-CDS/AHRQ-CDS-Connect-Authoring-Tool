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

FROM node:14.19.0-alpine as base

ENV NODE_ENV production

###############################################################################
# STAGE 1: install_backend
# - Install production dependencies for the api project
# - Copy over api source code
###############################################################################

FROM base as install_backend

# First copy just the package.json, yarn.lock, and local dependencies so that
# if they have not changed, we can use cached node_modules instead of
# redownloading them all.
COPY ./api/package.json /usr/src/app/api/package.json
COPY ./api/yarn.lock /usr/src/app/api/yarn.lock
COPY ./api/localDependencies /usr/src/app/api/localDependencies
WORKDIR /usr/src/app/api
RUN yarn --production --non-interactive install

# Then copy the rest of the source code
COPY ./api /usr/src/app/api

###############################################################################
# STAGE 2: test_backend
# - Install development dependencies for the api project
# - Run the api tests and pipe results to a log file
###############################################################################

FROM install_backend as test_backend

ENV NODE_ENV test
ENV CI true

WORKDIR /usr/src/app/api
RUN yarn --production=false --non-interactive install

# Some api code shares code w/ frontend, so bring that in for the tests
COPY ./frontend/src/data /usr/src/app/frontend/src/data
RUN yarn run test-ci 2>&1 | tee api-test-report.txt

###############################################################################
# STAGE 3: install_frontend
# - Install packages needed by yarn install (python2, make, g++)
# - Install production dependencies for the frontend project
# - Copy over frontend source code
###############################################################################

FROM base as install_frontend

RUN apk --no-cache add python2 make g++

# First copy just the package.json and yarn.lock so that if they have not
# changed, we can use cached node_modules instead of redownloading them all.
COPY ./frontend/package.json /usr/src/app/frontend/package.json
COPY ./frontend/yarn.lock /usr/src/app/frontend/yarn.lock
WORKDIR /usr/src/app/frontend
RUN yarn --production --non-interactive install

# Then copy the rest of the source code
COPY ./frontend /usr/src/app/frontend

###############################################################################
# STAGE 4: test_frontend
# - Install development dependencies for the frontend project
# - Run the frontend tests and pipe results to a log file
###############################################################################

FROM install_frontend as test_frontend

ENV NODE_ENV test
ENV CI true

WORKDIR /usr/src/app/frontend
RUN yarn --production=false --non-interactive install
RUN yarn run test-ci 2>&1 | tee frontend-test-report.txt

###############################################################################
# STAGE 5: build_frontend
# - Build frontend code to produce standard html, js, and css files
# - NOTE: Based on test_frontend because it needs development dependencies
###############################################################################

FROM test_frontend as build_frontend

ENV NODE_ENV production

WORKDIR /usr/src/app/frontend
RUN yarn build

###############################################################################
# STAGE 6: final
# - Setup NODE_ENV as an argument
# - Install PM2 process manager
# - Copy over all files needed at run-time
# - Expose necessary ports
# - Run as node (more secure than running as root)
###############################################################################

FROM base as final

ARG NODE_ENV
ENV NODE_ENV $NODE_ENV

RUN yarn global add pm2@4.4.1 -g

COPY --chown=node:node --from=install_backend /usr/src/app/api /usr/src/app/api
COPY --chown=node:node --from=install_frontend /usr/src/app/frontend/node_modules /usr/src/app/frontend/node_modules
COPY --chown=node:node --from=build_frontend /usr/src/app/frontend/build /usr/src/app/frontend/build
COPY --chown=node:node ./frontend/src/data /usr/src/app/frontend/src/data
COPY --chown=node:node ./frontend/.env /usr/src/app/frontend
COPY --chown=node:node ./frontend/server.js /usr/src/app/frontend
COPY --chown=node:node ./pm2.config.js /usr/src/app
# Copy over test logs because they're nice to have, but also to force the test stages to run
COPY --chown=node:node --from=test_backend /usr/src/app/api/api-test-report.txt /usr/src/app
COPY --chown=node:node --from=test_frontend /usr/src/app/frontend/frontend-test-report.txt /usr/src/app

EXPOSE 3001
EXPOSE 9000

USER node

WORKDIR /usr/src/app
CMD [ "pm2-docker", "pm2.config.js" ]
