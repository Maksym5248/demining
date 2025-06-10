# Use Node.js 22 with Alpine for a smaller image
FROM node:22-alpine AS base

# Install poppler-utils and poppler-data using apk
RUN apk update && apk add --no-cache poppler-utils

# Install yarn globally
RUN apk add --no-cache yarn
RUN apk add --no-cache python3
RUN apk add --no-cache pkgconfig pixman-dev
RUN apk add --no-cache cairo-dev
RUN apk add --no-cache pango-dev

ENV PORT=8080

# Debugging step to print the current working directory
RUN pwd

# Copy the isolated package source code
COPY . .

# Install dependencies
RUN yarn install --frozen-lockfile

# Use Functions Framework to expose the Cloud Function
CMD ["yarn", "start:v2"]