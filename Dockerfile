FROM node:16.3.0-slim

WORKDIR /home/coronaapi

COPY package.json .
COPY package-lock.json .

RUN npm ci --only=production
RUN mv node_modules prod_modules
RUN npm ci

COPY src/ src/
COPY resources/ resources/
COPY tsconfig.json .

RUN npm run build
RUN rm -rf src/ resources/ node_modules/
RUN mv prod_modules node_modules

ENV PORT=80

CMD ["npm", "start"]