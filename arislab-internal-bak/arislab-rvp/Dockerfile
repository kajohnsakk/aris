FROM node:8

WORKDIR /root

COPY package*.json ./

RUN npm install

COPY ./ /root

EXPOSE 1843 1880

CMD ["npm", "start"]