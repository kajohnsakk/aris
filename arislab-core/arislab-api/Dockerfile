FROM node:8-alpine

COPY ./ /root

WORKDIR /root

RUN apk update
RUN apk upgrade

# Change TimeZone
RUN apk add --update tzdata
ENV TZ=Asia/Bangkok

RUN npm install
RUN npm run build

CMD ["npm", "start"]