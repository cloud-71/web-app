FROM node:12.16.1-slim

WORKDIR /app

COPY . .

RUN npm install --ci

RUN npm run build

CMD ["npm", "run", "start"]
