FROM node:22

WORKDIR /usr/src/app

COPY . .

RUN npm install --production

RUN npm run build

CMD ["npm", "run"]