FROM node:8-alpine

COPY ./ /root
WORKDIR /root

RUN npm install
RUN npm run build

CMD ["npm", "start"]