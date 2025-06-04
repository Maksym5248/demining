# Use Node.js 20 with Alpine for a smaller image
FROM node:22-alpine AS base

# Install poppler-utils using apk
RUN apk update && apk add --no-cache poppler-utils

# Install yarn globally
RUN apk add --no-cache yarn

# Copy the source code
COPY . .

# Copy the shared-my package into node_modules
RUN mkdir -p node_modules/shared-my && \
    cp -r ../packages/shared/dist node_modules/shared-my/dist && \
    cp ../packages/shared/package.json node_modules/shared-my/package.json

# Install dependencies
RUN yarn install --frozen-lockfile

# Command to start the application
CMD ["node", "dist/index.js"]