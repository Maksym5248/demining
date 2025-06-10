# Use Node.js 22 with Alpine for a smaller image
FROM node:22-alpine AS base

# Install poppler-utils and poppler-data using apk
RUN apk update && apk add --no-cache poppler-utils poppler-data

# Debugging step to verify pdfimages availability
RUN which pdfimages && pdfimages -h

# Install yarn globally
RUN apk add --no-cache yarn

# # Set working directory to the isolated package
# WORKDIR /app

# # Debugging step to print the current working directory
# RUN pwd

# Copy the isolated package source code
COPY . .

# Install dependencies
RUN yarn install --frozen-lockfile

# Command to start the application
CMD ["node", "dist/index.js"]