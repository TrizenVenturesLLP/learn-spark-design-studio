
FROM node:20-alpine

WORKDIR /app
COPY backend/package*.json ./
RUN npm install
COPY backend/ ./

EXPOSE 5000
CMD ["node", "server.js"]  # Changed the path to match the correct entry point

