FROM node:18-alpine

WORKDIR /app

# Copy package files first to leverage Docker layer caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application files (volume mount in compose will override this during dev, 
# but building the image completely is good practice)
COPY . .

EXPOSE 5000

# Default command (can be overridden by docker-compose)
CMD ["npm", "run", "dev"]
