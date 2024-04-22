# Base on offical Node.js Alpine image
FROM node:18-alpine as builder

# Set working directory
WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED 1

# Copy package.json and package-lock.json before other files
# Utilise Docker cache to save re-installing dependencies if unchanged
COPY package.json package-lock.json ./

# Install dependencies
RUN --mount=type=secret,id=NODE_AUTH_TOKEN \
    echo '//npm.pkg.github.com/:_authToken='$(cat /run/secrets/NODE_AUTH_TOKEN) >> .npmrc
RUN npm ci

# Copy all files
COPY . .

# Copy hidden files
COPY .env.production .

ARG BUILD_ENV
ENV BUILD_ENV ${BUILD_ENV}

ARG RUNTIME_ENVIRONMENT
ENV RUNTIME_ENVIRONMENT ${RUNTIME_ENVIRONMENT}

ARG IMAGE_PROXY_URL
ENV IMAGE_PROXY_URL ${IMAGE_PROXY_URL}

ARG ASSET_PREFIX
ENV ASSET_PREFIX ${ASSET_PREFIX}

ARG CDN_URL
ENV CDN_URL ${CDN_URL}

# Build app
RUN npm run && npm run build

FROM gcr.io/distroless/nodejs:18 as runtime

WORKDIR /app

# Copy only needed files for next app
# see: https://github.com/vercel/next.js/blob/canary/examples/with-docker/Dockerfile
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Expose the listening port
EXPOSE 3000

CMD ["server.js"]
