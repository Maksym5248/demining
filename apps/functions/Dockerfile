# Stage 1: Build dependencies and packages
FROM node:22-alpine as build

WORKDIR /usr/src/app

# Copy root package.json and yarn.lock
COPY package.json .
COPY yarn.lock .

# Copy shared workspace packages
COPY ../..packages/shared ./packages/shared

# Install dependencies
RUN yarn install --pure-lockfile --non-interactive

# Build shared-my package
WORKDIR /usr/src/app/packages/shared
RUN yarn build

# Build functions package
WORKDIR /usr/src/app/apps/functions
RUN yarn build

# Stage 2: Create production image
FROM node:22-alpine

WORKDIR /usr/src/app

# Copy root package.json and yarn.lock
COPY package.json .
COPY yarn.lock .

# Copy built shared-my package from build stage
COPY --from=build /usr/src/app/packages/shared/package.json /usr/src/app/packages/shared/package.json
COPY --from=build /usr/src/app/packages/shared/dist /usr/src/app/packages/shared/dist

# Set environment to production
ENV NODE_ENV production

# Install production dependencies
RUN yarn install --pure-lockfile --non-interactive --production

# Set working directory to functions package
WORKDIR /usr/src/app/apps/functions

# Start the application
CMD ["node", "dist/index.js"]