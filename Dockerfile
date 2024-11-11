# Base on offical Node.js Alpine image
FROM node:20-alpine AS builder
RUN --mount=type=secret,id=NODE_AUTH_TOKEN \
    npm config set //npm.pkg.github.com/:_authToken=$(cat /run/secrets/NODE_AUTH_TOKEN)
RUN npm config set @navikt:registry=https://npm.pkg.github.com

RUN addgroup --system --gid 1069 nodejs
RUN adduser --system --uid 1069 nextjs

# Set working directory
WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED=1

# Copy package.json and package-lock.json before other files
# Utilise Docker cache to save re-installing dependencies if unchanged
COPY package*.json ./

# Copy all files
COPY . .

# Copy hidden files
COPY .env.production .

ARG ASSET_PREFIX
ENV ASSET_PREFIX=${ASSET_PREFIX}

# Build app
RUN npm ci
RUN npm run build

FROM gcr.io/distroless/nodejs20-debian12 AS runtime
WORKDIR /app

# Copy only needed files for next app
# see: https://github.com/vercel/next.js/blob/canary/examples/with-docker/Dockerfile
COPY --from=builder /app/public ./public


# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

# Expose the listening port
EXPOSE 3000

CMD ["server.js"]
