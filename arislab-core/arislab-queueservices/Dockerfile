FROM node:8-alpine

COPY ./ /root
WORKDIR /root

RUN apk add --no-cache \
    udev \
    ttf-freefont \
    chromium

RUN npm install
RUN npm run build

CMD ["npm", "start"]