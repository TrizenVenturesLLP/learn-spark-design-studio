
FROM node:20-alpine

WORKDIR /app
COPY backend/package*.json ./

# Install dependencies
RUN npm install
RUN npm install minio@7.1.3

# Copy backend code
COPY backend/ ./

# Expose the backend port
EXPOSE 5000

# Start the server
CMD ["node", "server.js"]
