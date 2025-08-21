# Use Node.js LTS
FROM node:20-alpine

# Create app dir
WORKDIR /usr/src/app

# Install deps
COPY package*.json ./
RUN npm install --production

# Copy app source
COPY . .

# Expose port
EXPOSE 3001

# Run app
CMD ["node", "server.js"]
