FROM node:lts-alpine

WORKDIR /usr/src/app
ENV NODE_ENV=production

COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN npm install --production --silent && mv node_modules ../
RUN npm install -g ts-node

COPY . .

EXPOSE 3000
RUN chown -R node /usr/src/app
USER node

CMD ["npm", "start"]
