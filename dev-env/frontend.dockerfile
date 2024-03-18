FROM node:21-alpine

COPY /frontend /src/

WORKDIR /src

RUN npm install

CMD ["npm", "run", "dev"]
