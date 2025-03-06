# Use a Node.js image as the base
FROM node:16-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to install dependencies
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the React app
RUN npm run build

# Install a simple HTTP server to serve the static files
RUN npm install -g serve

# Set the command to serve the build folder on port 3000
CMD ["serve", "-s", "build", "-l", "3000"]

# Expose port 3000 to access the app
EXPOSE 3000


