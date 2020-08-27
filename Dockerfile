FROM node:latest

WORKDIR /home/coronaapi

COPY package.json .
COPY package-lock.json .
COPY src/ src/
COPY resources/ resources/

RUN npm ci

ENV PORT=80

CMD ["npm", "start"]