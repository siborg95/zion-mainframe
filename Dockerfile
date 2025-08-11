# syntax=docker/dockerfile:1

# Build stage
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
# print versions to logs for sanity
RUN node -v && npm -v
# run build (Vite will print the real error above if it fails)
RUN npm run build

# Serve stage
FROM node:20-alpine
WORKDIR /app
RUN npm i -g serve
COPY --from=build /app/dist ./dist
ENV PORT=8080
EXPOSE 8080
CMD ["sh","-c","serve -s dist -l $PORT"]
