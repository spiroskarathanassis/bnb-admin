FROM node:20.17.0

WORKDIR /app

COPY package.json .
# COPY package-lock.json .

RUN npm install

COPY . ./app

EXPOSE 5173

CMD [ "npm", "run", "dev" ]
