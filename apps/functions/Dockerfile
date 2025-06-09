# Use Node.js 22 with Alpine for a smaller image
FROM node:22-alpine AS base

# Install poppler-utils using apk
RUN apk update && apk add --no-cache poppler-utils

# Install yarn globally
RUN apk add --no-cache yarn

# Set working directory to the isolated package
WORKDIR /app

# Copy the isolated package source code
COPY ./isolate .

# Install dependencies
RUN yarn install --frozen-lockfile

# Command to start the application
CMD ["node", "dist/index.js"]