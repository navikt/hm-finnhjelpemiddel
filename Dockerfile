# Base on offical Node.js Alpine image
FROM node:18-alpine as builder

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json before other files
# Utilise Docker cache to save re-installing dependencies if unchanged
COPY package*.json .

# Install dependencies
RUN npm install

# Copy all files
COPY . .

# Copy hidden files
COPY .env.production .

ARG BUILD_ENV
ENV BUILD_ENV ${BUILD_ENV}

ARG IMAGE_PROXY_URL
ENV IMAGE_PROXY_URL ${IMAGE_PROXY_URL}

# Build app
RUN npm run build

FROM gcr.io/distroless/nodejs:16 as runtime

WORKDIR /app

COPY --from=builder /app/package.json .
COPY --from=builder /app/next.config.js .
COPY --from=builder /app/.env.production .
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

# Expose the listening port
EXPOSE 3000

# Run npm start script when container starts
CMD ["node_modules/next/dist/bin/next", "start"]
