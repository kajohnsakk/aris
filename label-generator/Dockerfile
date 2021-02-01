FROM node:12-alpine

COPY . /root

WORKDIR /root/client
RUN npm run build

WORKDIR /root/server
RUN npm install
RUN npm run build

CMD ["npm", "start"]