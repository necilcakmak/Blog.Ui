# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Alpine build tools ekle (native modüller için gerekli)
RUN apk add --no-cache python3 make g++ bash

# package.json ve package-lock.json/ pnpm-lock.yaml'ı kopyala
COPY package*.json ./

# Bağımlılıkları yükle
RUN npm install

# Tüm kaynak kodu kopyala
COPY . .

# Next.js uygulamasını build et
RUN npm run build

# Stage 2: Production image
FROM node:20-alpine

WORKDIR /app

# Sadece production bağımlılıkları yükle
COPY package*.json ./
RUN npm install --production && npm install typescript

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.ts ./
COPY --from=builder /app/package.json ./

# Port aç
EXPOSE 3000

# Uygulamayı başlat
CMD ["npm", "start"]
