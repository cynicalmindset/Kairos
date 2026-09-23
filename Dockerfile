FROM oven/bun:1

WORKDIR /app

COPY package.json bun.lock ./
COPY prisma ./prisma

RUN bun install --frozen-lockfile
RUN bunx prisma generate

COPY . .

EXPOSE 3000

CMD ["bun", "run", "src/index.ts"]