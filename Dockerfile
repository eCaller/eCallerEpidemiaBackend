# build stage
FROM node:10.16.2-alpine as build-stage
WORKDIR /
RUN npm install
COPY . .
RUN npm run build

# ejecucion

EXPOSE 8443
#CMD ["ls", "./dist"]
CMD ["node", "./dist/server.js"]