FROM node:20-alpine

WORKDIR /app
COPY backend/package*.json ./
RUN npm install
COPY backend/ ./

EXPOSE 5000
CMD ["node", "/server.js"]  # Adjust path if your entry point is different