FROM node:8.10.0

RUN npm install webpack -g

RUN mkdir -p /usr/src/login-web-app
WORKDIR /usr/src/login-web-app
COPY package.json /usr/src/login-web-app/
RUN npm install
COPY . /usr/src/login-web-app

RUN webpack

ENV NODE_ENV=production 
ENV PORT=8080
CMD [ "/usr/local/bin/node", "./dist/index.html" ]

EXPOSE 8080
