# Multi-stage build for production optimization
FROM node:20-alpine AS base

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Production dependencies stage
FROM base AS production-deps
RUN npm ci --only=production --ignore-scripts

# Development stage
FROM base AS development
ENV NODE_ENV=development
RUN npm install
COPY . .
CMD ["dumb-init", "npm", "run", "dev"]

# Build stage (for SCSS compilation if needed)
FROM base AS build
COPY package*.json ./
RUN npm install
COPY . .
# Compile SCSS to CSS
RUN npx sass public/index.scss public/index.css

# Production stage
FROM base AS production
ENV NODE_ENV=production

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Copy production dependencies
COPY --from=production-deps /app/node_modules ./node_modules

# Copy application files
COPY --chown=nodejs:nodejs . .

# Copy compiled CSS from build stage
COPY --from=build --chown=nodejs:nodejs /app/public/index.css ./public/index.css

# Remove unnecessary files for production
RUN rm -rf public/index.scss \
    && rm -rf .git \
    && rm -rf .github

# Switch to non-root user
USER nodejs

# Health check (uses PORT env variable)
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:' + (process.env.PORT || 3000), (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Use dumb-init to handle signals properly
CMD ["dumb-init", "node", "server.js"]
