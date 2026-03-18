FROM node:20-alpine

# Set working directory
WORKDIR /app

# Set environment to production
ENV NODE_ENV=production

# Install dependencies only (leverage Docker cache)
COPY package*.json ./
RUN npm ci --only=production

# Copy source code
COPY . .

# Create a directory for local uploads and ensure appropriate permissions
RUN mkdir -p public/uploads && chown -R node:node public/uploads

# Expose the API port
EXPOSE 5000

# Switch to non-root user for security
USER node

# Start the application
CMD ["npm", "start"]
