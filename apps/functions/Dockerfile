# Use Node.js 22 with Alpine for a smaller image
FROM node:22-alpine AS base

# Install poppler-utils using apk
RUN apk update && apk add --no-cache poppler-utils

# Install yarn globally
RUN apk add --no-cache yarn

# Set the working directory
WORKDIR /app

# Copy the original package.json and yarn.lock files
COPY package.json yarn.lock ./

# Create a temporary package.json for Docker builds
RUN jq '.dependencies["shared-my"] = "file:../../packages/shared"' package.json > temp.package.json && mv temp.package.json package.json

# Install dependencies for Yarn Workspaces
RUN yarn install --frozen-lockfile --network-concurrency 1

# Copy the rest of the source code
COPY . .

# Command to start the application
CMD ["node", "dist/index.js"]