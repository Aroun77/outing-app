# =====================================================================
# ÉTAPE 1 (STAGE 1) : "builder" — Compilation du TypeScript en JavaScript
# =====================================================================
FROM node:22-alpine AS builder

WORKDIR /app

# 1. On copie d'abord UNIQUEMENT package*.json pour profiter du cache Docker (Layer Caching)
COPY package*.json ./

# 2. On installe toutes les dépendances (y compris TypeScript pour pouvoir compiler)
RUN npm install

# 3. On copie le code source et on compile TypeScript -> JavaScript (dans /app/dist)
COPY tsconfig.json ./
COPY src ./src
RUN npm run build

# =====================================================================
# ÉTAPE 2 (STAGE 2) : "production" — Image finale ultra-légère et sécurisée
# =====================================================================
FROM node:22-alpine AS production

WORKDIR /app
ENV NODE_ENV=production

# 1. On installe UNIQUEMENT les dépendances de production (pas de TypeScript ni tsx)
COPY package*.json ./
RUN npm install --omit=dev && npm cache clean --force

# 2. On récupère uniquement le code JavaScript compilé depuis l'étape 1 ("builder")
COPY --from=builder /app/dist ./dist

# 3. Sécurité DevSecOps : Ne JAMAIS faire tourner un conteneur en "root" !
# L'image officielle node:alpine fournit déjà un utilisateur limité nommé "node".
USER node

# 4. Documentation du port écouté par le conteneur
EXPOSE 3000

# 5. Healthcheck natif Docker : vérifie toutes les 30s que /health répond 200 OK
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1

# 6. Démarrage direct avec "node" (et pas "npm start") pour recevoir le signal SIGTERM
CMD ["node", "dist/server.js"]
