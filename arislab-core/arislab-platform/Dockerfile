# FROM node:8-alpine

# WORKDIR /root

# COPY ./ .

# RUN yarn install

# CMD ["yarn", "start"]

FROM node:8-alpine as build-stage

WORKDIR /app

COPY package*.json ./
COPY yarn*.lock ./

RUN yarn install

COPY . .

RUN yarn build

FROM nginx:stable-alpine as production-stage

COPY --from=build-stage /app/build /usr/share/nginx/html

COPY nginx/nginx.conf /etc/nginx/conf.d

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]