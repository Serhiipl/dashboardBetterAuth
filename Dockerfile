# # 1. Build stage
# FROM node:22-alpine AS builder
# WORKDIR /app

# # Копіюємо лише залежності для кешування
# COPY package.json package-lock.json ./
# RUN npm install

# # Копіюємо увесь проєкт
# COPY . .

# # Генерація Prisma Client
# RUN npx prisma generate

# # Білд Next.js
# RUN npm run build

# # 2. Production stage
# FROM node:22-alpine AS runner
# WORKDIR /app

# ENV NODE_ENV=production
# ENV PORT=3000

# # Копіюємо результати білду
# COPY --from=builder /app/.next ./.next
# COPY --from=builder /app/public ./public
# COPY --from=builder /app/package.json ./package.json
# COPY --from=builder /app/node_modules ./node_modules
# COPY --from=builder /app/prisma ./prisma

# # Копіюємо потрібні конфіги та код
# COPY --from=builder /app/next.config.js ./next.config.js
# COPY --from=builder /app/tailwind.config.ts ./tailwind.config.ts
# COPY --from=builder /app/postcss.config.mjs ./postcss.config.mjs
# COPY --from=builder /app/eslint.config.mjs ./eslint.config.mjs
# COPY --from=builder /app/tsconfig.json ./tsconfig.json

# COPY --from=builder /app/app ./app
# COPY --from=builder /app/components ./components
# COPY --from=builder /app/lib ./lib
# COPY --from=builder /app/hooks ./hooks
# COPY --from=builder /app/middleware.ts ./middleware.ts

# EXPOSE 3000

# # Запуск Next.js у продакшн
# CMD ["node_modules/.bin/next", "start"]
# 1. Build stage
FROM node:22-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .

# Генерація Prisma Client
RUN npx prisma generate

# Білд Next.js
RUN npm run build

# 2. Production stage
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Копіюємо standalone білд Next.js
COPY --from=builder /app/.next/standalone ./

# Копіюємо статичні файли (якщо є)
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Копіюємо Prisma schema (якщо воно читається у рантаймі)
COPY --from=builder /app/prisma ./prisma

# У деяких випадках також варто скопіювати .env, якщо він потрібен
# COPY --from=builder /app/.env ./.env

EXPOSE 3000
CMD ["node", "server.js"]