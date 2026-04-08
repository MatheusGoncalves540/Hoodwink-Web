# Build stage
FROM node:20-slim AS builder
WORKDIR /app

# Copia package lock e package para instalar dependências
COPY package.json package-lock.json ./
RUN npm ci

# Copia o restante da aplicação e gera a build de produção
COPY . .
RUN npm run build

# Runtime stage
FROM nginx:stable-alpine
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
