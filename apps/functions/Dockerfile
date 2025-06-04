# Use Node.js 20 with Alpine for a smaller image
FROM node:20-alpine AS base

# Install poppler-utils using apk
RUN apk update && apk add --no-cache poppler-utils

# Install yarn globally
RUN apk add --no-cache yarn

# Copy the source code
COPY . .

# Copy the shared workspace files
COPY ../../packages/shared ./packages/shared

# Install dependencies
RUN yarn install --frozen-lockfile

# Command to start the application
CMD ["node", "dist/index.js"]