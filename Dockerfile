# build stage
FROM node:10.16.2-alpine as build-stage
COPY . /app
WORKDIR /app
# Para la versión alpine
#RUN apk --no-cache add --virtual builds-deps build-base python
RUN npm install tsc
RUN npm install typescript
RUN npm install

RUN npm run build

# ejecucion

EXPOSE 8443
CMD ["node", "./dist/server.js"]