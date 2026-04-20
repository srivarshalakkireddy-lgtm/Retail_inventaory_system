FROM node:18-alpine

WORKDIR /app

# Copy package files first to leverage Docker layer caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application files
COPY . .

EXPOSE 3000

# Default command (can be overridden by docker-compose)
CMD ["npm", "start"]
