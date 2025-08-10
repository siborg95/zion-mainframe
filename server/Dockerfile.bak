FROM node:20-alpine

# (optional) toolchain for any native deps; harmless if unused
RUN apk add --no-cache --virtual .gyp python3 make g++

WORKDIR /app

# npm defaults for CI builds
ENV NPM_CONFIG_REGISTRY=https://registry.npmjs.org/ \
    NPM_CONFIG_AUDIT=false \
    NPM_CONFIG_FUND=false

# Copy manifest(s)
COPY package.json package-lock.json* ./

# If lockfile exists use ci, otherwise use install
RUN if [ -f package-lock.json ]; then \
      npm ci --omit=dev --legacy-peer-deps --no-audit --no-fund; \
    else \
      npm install --omit=dev --legacy-peer-deps --no-audit --no-fund; \
    fi

# App source
COPY . .

ENV NODE_ENV=production \
    PORT=8080
EXPOSE 8080

CMD ["node", "server.js"]
