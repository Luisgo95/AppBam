FROM node:12.18.1 AS build

### STAGE 1: Build app ###
WORKDIR /usr/src/app

COPY package.json package-lock.json ./

RUN npm install 

COPY . .

RUN npm run build

### STAGE 2: Run ###

FROM nginx:1.17.1-alpine

COPY nginx.conf /etc/nginx/nginx.conf

COPY --from=build /usr/src/app/dist/app-bam /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]