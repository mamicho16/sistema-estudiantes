# Use the official Node.js 16 image from Docker Hub
FROM node:16

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json 
COPY package.json ./

# Install dependencies in the container
RUN npm install

# Copy the rest of your project into the container
COPY . .

# Expose the port the app runs on
EXPOSE 3000