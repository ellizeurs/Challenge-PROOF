## Download Node Alpine image
FROM node:alpine

## Define the work directory on container disk
WORKDIR /usr/app/show-log

## Copy everything that starts with package and ends with .json into the /usr/app/show-log folder
COPY package*.json ./

## Run npm install to add dependences and create node_modules foldes
RUN npm install

## Copy all files on Docker file directory to /usr/app/syslog container folder
## Except node_modules folder because .dockerignore folder
COPY . .

## Container will be listening for accesses on port 3000
EXPOSE 3000

## Run npm start to run start script on package.json
CMD npm start