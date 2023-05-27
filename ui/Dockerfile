# Use an official Node runtime as the parent image
FROM node:17-alpine

# Set the working directory in the container
WORKDIR /usr/src/app

# Add `/usr/src/app/node_modules/.bin` to $PATH
ENV PATH /usr/src/app/node_modules/.bin:$PATH

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install the application dependencies
RUN npm install --silent

ENV WEATHER_FILE=/data/weather.json

# Copy the rest of your app's source code
COPY . ./

# Build the application
RUN npm run build

# Expose port 3000 to the outside world
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
