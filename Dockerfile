FROM europe-north1-docker.pkg.dev/cgr-nav/pull-through/nav.no/node:26-dev  AS builder

RUN --mount=type=secret,id=NODE_AUTH_TOKEN sh -c \
    'npm config set //npm.pkg.github.com/:_authToken=$(cat /run/secrets/NODE_AUTH_TOKEN)'
RUN npm config set @navikt:registry=https://npm.pkg.github.com

WORKDIR /app

COPY package*.json ./
RUN npm ci

# Copy package.json and package-lock.json before other files
# Utilise Docker cache to save re-installing dependencies if unchanged
COPY . .
COPY .env.production .

ENV NEXT_TELEMETRY_DISABLED=1

ARG BUILD_ENV
ENV BUILD_ENV=${BUILD_ENV}

ARG RUNTIME_ENVIRONMENT
ENV RUNTIME_ENVIRONMENT=${RUNTIME_ENVIRONMENT}

ARG IMAGE_PROXY_URL
ENV IMAGE_PROXY_URL=${IMAGE_PROXY_URL}

ARG ASSET_PREFIX
ENV ASSET_PREFIX=${ASSET_PREFIX}

ARG CDN_URL
ENV CDN_URL=${CDN_URL}

ARG FARO_URL
ENV FARO_URL=${FARO_URL}

ARG ALTERNATIVER_BACKEND_AUDIENCE
ENV ALTERNATIVER_BACKEND_AUDIENCE=${ALTERNATIVER_BACKEND_AUDIENCE}

ARG BFF_AUDIENCE
ENV BFF_AUDIENCE=${BFF_AUDIENCE}

RUN npm run build

FROM europe-north1-docker.pkg.dev/cgr-nav/pull-through/nav.no/node:26-slim AS runtime

WORKDIR /app

# Copy only needed files for next app
# see: https://github.com/vercel/next.js/blob/canary/examples/with-docker/Dockerfile
COPY --from=builder --chown=1069:1069 /app/public ./public


# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=1069:1069 /app/.next/standalone ./
COPY --from=builder --chown=1069:1069 /app/.next/static ./.next/static

EXPOSE 3000

CMD ["server.js"]
