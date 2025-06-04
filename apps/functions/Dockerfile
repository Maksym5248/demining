\
# Choose a Node.js version compatible with your project (e.g., 18 or 20 from your package.json)
# Based on your package.json, you are using Node 22.
# However, Firebase Functions currently supports up to Node 20 for 2nd Gen.
# Let's use Node 20, ensure your code is compatible or adjust if needed.
FROM node:20-slim

# Set the working directory in the container
# This should be the root of your functions code from Firebase's perspective
WORKDIR /workspace

# Install poppler-utils
# This provides the pdfimages utility
RUN apt-get update && \\
    apt-get install -y poppler-utils --no-install-recommends && \\
    # Clean up apt cache to reduce image size
    rm -rf /var/lib/apt/lists/*

# Copy package.json and package-lock.json (or yarn.lock if you use yarn)
# Assuming this Dockerfile is in apps/functions, and package.json is also there.
COPY package.json package-lock.json* yarn.lock* ./
# If you only use yarn, you might remove package-lock.json* and vice-versa

# Install production dependencies for your functions
# Check if you use npm or yarn based on your lock file or habits
# RUN npm install --production
# If you use yarn:
RUN yarn install --production --frozen-lockfile

# Copy the rest of your functions source code
COPY . .