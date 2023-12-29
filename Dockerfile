FROM node:16
WORKDIR usr/src/app
RUN apt-get update && apt-get install -y build-essential
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm","start"]