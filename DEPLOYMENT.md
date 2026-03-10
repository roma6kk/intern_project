# 🚀 Innogram Deployment Guide

This guide explains how to deploy the Innogram Microservices Architecture to a production environment (e.g., Ubuntu VPS).

## 1. Prerequisites

Before starting, ensure your server has the following installed:
*[Docker](https://docs.docker.com/engine/install/)
*   [Docker Compose](https://docs.docker.com/compose/install/)
*   Git

## 2. Setup Environment

1. Clone the repository to your server:
   ```bash
   git clone https://github.com/your-username/innogram.git
   cd innogram

2. Create environment files. You must create a .env file inside each microservice folder based on their .env.example:
    code
    Bash
    cp apps/core_microservice/.env.example apps/core_microservice/.env
    cp apps/auth_microservice/.env.example apps/auth_microservice/.env
    cp apps/notifications_consumer_microservice/.env.example apps/notifications_consumer_microservice/.env

3. Build and Run
    Execute the following command in the root of the project. This will build all microservices using Turborepo pruning and start them in detached mode.
    code
    Bash
    docker-compose -f docker-compose.prod.yml up -d --build
4. Database Migration
    Once the containers are up and running, you need to apply the Prisma migrations to the production database:
    code
    Bash
    docker exec -it innogram-core npx prisma migrate deploy
5. Exposing to the Web (Nginx Reverse Proxy)
    It is highly recommended to set up an Nginx reverse proxy to route traffic from port 80/443 to the respective microservices and enable SSL (HTTPS) using Certbot.
    api.yourdomain.com -> routes to localhost:3000 (Core Microservice Gateway)
    app.yourdomain.com -> routes to localhost:3002 (Next.js Client)