FROM node:10-alpine

WORKDIR '/usr/src/bar-menu'

# Install dependencies
COPY package*.json ./
RUN npm install --production

# Get the rest of the code
COPY . .

# Start the server
CMD [ "npm", "start" ]


