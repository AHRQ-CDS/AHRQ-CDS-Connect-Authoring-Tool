# CDS Connect Authoring Tool

## About

The Clinical Decision Support (CDS) Authoring Tool is a web-based application aimed at simplifying the creation of production-ready CQL code. The project is based on "concept templates" (e.g. gender, HDL Cholesterol, etc.), which allow for additional clinical concepts to be included in the future. Concept modifiers are included to allow for more flexible definitions (e.g. most recent, value comparisons, etc.).

The CDS Authoring Tool is part of the [CDS Connect](https://cds.ahrq.gov/cdsconnect) project, sponsored by the [Agency for Healthcare Research and Quality](https://www.ahrq.gov/) (AHRQ), and developed under contract with AHRQ by [MITRE's CAMH](https://www.mitre.org/centers/cms-alliances-to-modernize-healthcare/who-we-are) FFRDC.

## Contributions

For information about contributing to this project, please see [CONTRIBUTING](CONTRIBUTING.md).

## Development Details

This project uses the MERN stack: Mongo, Express, React, and NodeJS. The project is split into two components:

- [api](api): the backend Express API server
- [frontend](frontend): the frontend React web application

For specific development details of each component, including configuration, see their respective README files.

## Run (Development Quick Start)

### Prerequisites

First, ensure you have [Node.js LTS](https://nodejs.org/) and [MongoDB](https://www.mongodb.com/download-center/community) installed. The CDS Authoring Tool is tested using MongoDB 6.0.x, but later versions are expected to work.

MongoDB can be run using a docker image if desired via

```bash
mkdir -p db
docker run --name=mongodb --volume=$PWD/db:/data/db -p 27017:27017 --restart=unless-stopped --detach=true mongo:6.0
```

This creates a local db directory and then runs a MongoDB docker container that will store files in that directory.

### Install Dependencies

Each of the subprojects (_api_ and _frontend_) must have the dependencies installed via _npm_. This can be done as follows:

```bash
cd api
npm install
```

After the api dependency install successfully runs, install the frontend dependencies:

```bash
cd ../frontend
npm install
```

After the frontend dependency install runs, go back to the root folder:

```bash
cd ..
```

### Configure Authentication

The CDS Authoring Tool requires authentication. Currently LDAP authentication and local file authentication are supported. For local development, the simplest approach is to use local user authentication. To enable it, copy the minimal-example and example-local-users configuration files to `local.json` and `local-users.json`.

_NOTE: The following example uses `cp`. If you are on Windows, use `copy` instead._

```bash
cp api/config/minimal-example.json api/config/local.json
cp api/config/example-local-users.json api/config/local-users.json
```

This will enable the following two users:

- User: `demo`, Password: `password`
- User: `demo2`, Password: `password2`

Of course, these default users and passwords should _never_ be enabled on a public-facing system.

### Run the API and Frontend

In one terminal, run the backend API server:

```bash
cd api
npm start
```

In another terminal, run the frontend server:

```bash
cd frontend
npm start
```

NOTE: Ensure MongoDB is running before starting the CDS Authoring Tool.

When running, the Authoring Tool will be available at [http://localhost:3000/authoring](http://localhost:3000/authoring).

### Testing CQL Execution Results

Testing CQL execution in development requires the API to be configured to use the CQL-to-ELM
Translator and also requires the Translator to be running locally.

To configure the API, edit the configuration settings in `api/config/local.json` to point to a local
instance of the Translator:

```json
"cqlToElm": {
  "url": "http://localhost:8080/cql/translator",
  "active": true
}
```

This should replace any existing cqlToElm configuration block where `active` is set to `false`. See
the Configuration section of the [API README](api/README.md#configuration) for details on configuring the API.

Once the configuration is updated and the API has been restarted the translation service can be run
locally in docker via:

```bash
docker run -p 8080:8080 cqframework/cql-translation-service:v2.3.0
```

### Running tests

The API tests can be run with

```bash
npm --prefix api test
```

The frontend tests can be run with

```bash
npm --prefix frontend test
```

## Docker

This project can also be built into a Docker image and deployed as a Docker container. To do any of the commands below, [Docker](https://www.docker.com/) must be installed.

### Building the docker image

To build the Docker image, execute the following command from the project's root directory (the directory containing _api_ and _frontend_):

```
docker build -t cdsauthoringtool .
```

### Running the docker container

For the Authoring Tool to run in a docker container, MongoDB and CQL-to-ELM docker containers must be linked. The following commands run the necessary containers, with the required links and exposed ports:

```bash
docker run --name cat-cql2elm -d cqframework/cql-translation-service:v2.3.0
docker run --name cat-mongo -d mongo:6.0
docker run --name cat \
  --link cat-cql2elm:cql2elm \
  --link cat-mongo:mongo \
  -e "CQL_TO_ELM_URL=http://cql2elm:8080/cql/translator" \
  -e "CQL_FORMATTER_URL=http://cql2elm:8080/cql/formatter" \
  -e "MONGO_URL=mongodb://mongo/cds_authoring" \
  -e "AUTH_SESSION_SECRET=secret" \
  -e "AUTH_LDAP_URL=ldap://localhost:389" \
  -e "AUTH_LDAP_BIND_DN=cn=root" \
  -e "AUTH_LDAP_BIND_CREDENTIALS={{password}}" \
  -e "AUTH_LDAP_SEARCH_BASE=ou=passport-ldapauth" \
  -e "AUTH_LDAP_SEARCH_FILTER=(uid={{username}})" \
  -e "NODE_ENV=development" \
  -p "3001:3001" \
  -p "9000:9000" \
  cdsauthoringtool
```

To run the CDS Authoring Tool in a detached process, add a `-d` to the run command (before `cdsauthoringtool`).

Of course you will need to modify some of the values above according to your environment (e.g., LDAP details).

**Proxying the API**

By default, the server on port 9000 will proxy requests on _/authoring/api_ to the local API server using express-http-proxy. In production environments, a dedicated external proxy server may be desired. In that case, the external proxy server will be responsible for proxying _/authoring/api_ to port 3001. To accomodate this, disable the express-http-proxy by adding this addition flag to the last command above:

```
  -e "API_PROXY_ACTIVE=false" \
```

**Enabling HTTPS**

By default, the API server and frontend server listen over unsecure HTTP. To listen over HTTPS, add these three flags to the `docker run` command above:

```
  -v /data/ssl:/data/ssl \
  -e "HTTPS=true" \
  -e "SSL_KEY_FILE=/data/ssl/server.key" \
  -e "SSL_CRT_FILE=/data/ssl/server.cert" \
```

You should substitute the volume mapping and SSL filenames as needed for your specific environment.

**Using the Container**

When the container is running, access the app at [http://localhost:9000](http://localhost:9000).

To stop the container:

```
docker stop cat cat-mongo cat-cql2elm
```

To start the containers again:

```
docker start cat-cql2elm cat-mongo cat
```

To remove the containers (usually when building new images):

```
docker rm cat cat-mongo cat-cql2elm
```

**NOTE: This configuration stores data in Mongo's container. This means it is tied to the lifecycle of the mongo container and is _not_ persisted when the container is removed.**

### Using Docker Compose

Alternately, use Docker Compose to build and run all of the containers. Execute:

```
docker compose up
```

The first time, it will build the cdsauthoringtoolapi_cat and cdsauthoringtool_cat images. Subsequent times it may re-use the already built images. To force it to rebuild, pass in the `--build` flag.

To stop _and remove_ the containers, run:

```
docker compose down
```

## LICENSE

Copyright 2016-2023 Agency for Healthcare Research and Quality

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
