FROM node:8-alpine

COPY ./ /root

WORKDIR /root

RUN apk add --no-cache --virtual .gyp \
    python \
    make \
    g++ \
    && npm install \
    && apk del .gyp

RUN npm run build

CMD ["npm", "start"]