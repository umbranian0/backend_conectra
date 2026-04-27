FROM node:20-bookworm-slim

WORKDIR /opt/app

COPY package.json package-lock.json ./

RUN npm ci --no-audit --no-fund

COPY config ./config
COPY public ./public
COPY src ./src
COPY tsconfig.json ./
COPY .env.example ./

EXPOSE 1337

CMD ["npm", "run", "develop"]
