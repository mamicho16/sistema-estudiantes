# Use the official Node.js 14 LTS image from Docker Hub
FROM node:16

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies in the container
RUN npm install

# Copy the rest of your project into the container
COPY . .

# Expose the port the app runs on
EXPOSE 3000

# Command to run when starting the container
CMD ["npm", "run", "start"]
