# CDS Connect Authoring Tool

## About
Developed by The MITRE Corporation, the CDS Connect Authoring Tool is a project aimed at simplifying the creation of production-ready CQL code. The project is based on "concept templates" (e.g. gender, HDL Cholesterol, etc.), which allow for additional clinical concepts to be included in the future. Concept modifiers are included to allow for more flexible definitions (e.g. most recent, value comparisons, etc.).

## License
TODO

## Development Details

This project uses the MERN stack: Mongo, Express, React, and NodeJS.  The project is split into two components:
- [api](api): the backend Express API server
- [frontend](frontend): the frontend React web application

For specific development details of each component, including configuration, see their respective README files.

### Run (Development)

To allow for simple development, a _Procfile_ is provided which will launch the _api_ and _frontend_ projects in development mode.  To use the Procfile, you must install [node-foreman](https://www.npmjs.com/package/foreman) _(prerequisites: [Node.js LTS](https://nodejs.org/) and [Yarn](https://yarnpkg.com/)_.

```bash
yarn add global foreman
```

Once node-foreman is installed, you can run the Procfile via:

```bash
nf start
```

NOTE: Please ensure MongoDB is running before starting the CDS Authoring Tool.

## Docker

This project can also be built into a Docker image and deployed as a Docker container.  To do any of the commands below, [Docker](https://www.docker.com/) must be installed.

### Building the docker image

To build the Docker image, execute the following command from the project's root directory (the directory containing _api_ and _frontend_):
```
docker build -t cdsauthoringtool .
```

### Running the docker container

For the authoring tool to run in a docker container, MongoDB and CQL-to-ELM docker containers must be linked.  The following commands run the necessary containers, with the required links and exposed ports:
```bash
docker run --name cat-cql2elm -d cqframework/cql-translation-service:v1.2.16
docker run --name cat-mongo -d mongo:3.4
docker run --name cat \
  --link cat-cql2elm:cql2elm \
  --link cat-mongo:mongo \
  -e "NODE_ENV=development" \
  -e "REPO_BASE_URL=https://cdsconnect.ahrqdev.org/" \
  -e "REPO_URL=https://cdsconnect.ahrqdev.org/" \
  -e "CQL_TO_ELM_URL=http://cql2elm:8080/cql/translator" \
  -e "MONGO_URL=mongodb://mongo/cds_authoring" \
  -e "AUTH_SESSION_SECRET=secret" \
  -e "AUTH_LDAP_URL=ldap://localhost:389" \
  -e "AUTH_LDAP_BIND_DN=cn=root" \
  -e "AUTH_LDAP_BIND_CREDENTIALS={{password}}" \
  -e "AUTH_LDAP_SEARCH_BASE=ou=passport-ldapauth" \
  -e "AUTH_LDAP_SEARCH_FILTER=(uid={{username}})" \
  -p "3001:3001" \
  -p "9000:9000" \
  cdsauthoringtool
```
Of course you will need to modify some of the values above according to your environment (e.g., LDAP details).

By default, the server on port 9000 will proxy requests on _/authoring/api_ to the local API server using express-http-proxy.  In production environments, a dedicated external proxy server may be desired.  In that case, the external proxy server will be responsible for proxying _/authoring/api_ to port 3001.  To accomodate this, disable the express-http-proxy by adding this addition flag to the last command above:
```
  -e "API_PROXY_ACTIVE=false" \
```

To run the CDS Authoring Tool in a detached process, add a `-d` to the run command (before `cdsauthoringtool`).

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

**NOTE: This configuration stores data in Mongo's container.  This means it is tied to the lifecycle of the mongo container and is _not_ persisted when the container is removed.**

### Using Docker Compose

Alternately, use Docker Compose to build and run all of the containers.  Execute:
```
docker-compose up
```

The first time, it will build the cdsauthoringtoolapi\_cat and cdsauthoringtool\_cat images.  Subsequent times it may re-use the already built images.  To force it to rebuild, pass in the `--build` flag.

To stop _and remove_ the containers, run:
```
docker-compose down
```

### Bonus: Running Tests in Docker

CDS Authoring Tool tests are broken up into frontend and backend tests.

To run the frontend tests in a temporary docker container (for example, to ensure it works before deploying), run the following command:
```bash
docker run --rm -e "CI=true" -e "NODE_ENV=test" -w /usr/src/app/frontend cdsauthoringtool yarn test
```

To run the backend tests in a temporary docker container:
```bash
docker run --rm -e "CI=true" -e "NODE_ENV=test" -w /usr/src/app/api cdsauthoringtool yarn test
```
