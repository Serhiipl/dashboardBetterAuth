# Dockerfile for Next.js application with Prisma

# 1. Build stage
FROM node:22-alpine AS builder
WORKDIR /app

# Копіюємо залежності окремо для кешування
COPY package.json package-lock.json ./
RUN npm install

# Копіюємо решту проекту
COPY . .

# Генеруємо Prisma Client
RUN npx prisma generate

# Білдимо Next.js
RUN npm run build

# 2. Production stage
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Копіюємо готові білди
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma


EXPOSE 3000

CMD ["node_modules/.bin/next", "start"]