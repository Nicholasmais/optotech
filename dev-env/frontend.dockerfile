FROM node:21-alpine

WORKDIR /src/

COPY ./frontend /src

RUN npm install

CMD ["npm", "run", "dev"]
