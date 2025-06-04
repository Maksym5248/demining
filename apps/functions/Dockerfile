# Use Node.js 20 with Alpine for a smaller image
FROM node:20-alpine AS base

# Install poppler-utils using apk
RUN apk update && apk add --no-cache poppler-utils

# Copy the source code
COPY . .

# Install dependencies
RUN yarn install --production

# Command to start the application
CMD ["node", "dist/index.js"]