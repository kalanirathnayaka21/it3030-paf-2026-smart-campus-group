# --- Stage 1: Build Stage ---
FROM node:20-alpine AS build

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build the application
RUN npm run build

# --- Stage 2: Run Stage ---
FROM nginx:stable-alpine

# Copy built assets from the build stage to nginx's serving directory
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80 (standard nginx port)
EXPOSE 80

# Run nginx
CMD ["nginx", "-g", "daemon off;"]
