# Pre-built solution for Email Airdrop via Apillon API (backend)

//TODO: description

## Environment variables

For local development and running app you will need to configure some environment variables. List of all supported vars can be found in [`src/config/env.ts`](/src/config/env.ts). 

For local development you should create `.env` file. To run this app in Docker, you can create `.env.deploy` and `.env.sql.deploy` and use provided [`docker-compose.yml`](/docker-compose.yml)

### .env

For running locally, create new `.env` file in project root folder (`backend/`) and set at least all the variables (probably with different values) as in `.env.deploy` file described bellow.

### .env.deploy

For running a docker image with [`docker-compose.yml`](/docker-compose.yml) you should create `.env.deploy` file like this:

```sh

MYSQL_HOST: mysql # DB host (container name or ip/url)
MYSQL_DB: airdrop
MYSQL_USER: root
MYSQL_PASSWORD: Pa55worD?! # set your DB password (same as in .env.sql.deploy)

APP_URL: 'http://your-custom-url.com'  # set URL of your frontend application
ADMIN_WALLET: # your EVM wallet address 

# Apillon configuration
# Create (free) account at https://apillon.io to and setup API key and NFT collection
APILLON_KEY: # Apillon api key
APILLON_SECRET: # Apillon api key secret
COLLECTION_UUID:  # Apillon NFT collection UUID

# Your email server configuration
SMTP_HOST: 
SMTP_PORT: '465'
SMTP_USERNAME: 
SMTP_PASSWORD: 
SMTP_EMAIL_FROM: 
SMTP_NAME_FROM: 'NFT Airdrop'

# API configuration (you can just live it as it is or appropriate fix dockerfile and compose)
API_HOST: 0.0.0.0
API_PORT: 3000
```

### .env.sql.deploy

For running a mysql docker image with [`docker-compose.yml`](/docker-compose.yml) you should create `.env.sql.deploy` file like this:

```sh
MYSQL_ROOT_PASSWORD: Pa55worD?! # set your DB password (same as in .env.deploy)
MYSQL_DATABASE: airdrop

```
## Deploying with docker

Build docker image with script [`./build-image.sh`](/build-image.sh) script or by running docker build command, for example:

```sh
docker build -t ps-email-airdrop .
docker tag ps-email-airdrop ps-email-airdrop:latest
```

If you correctly setup .env files, you can run app in docker by running

```sh
docker compose up -d
```
