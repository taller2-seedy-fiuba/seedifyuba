FROM node:12.18.1

# Create app directory
WORKDIR /usr/src/app

# Bundle app source
COPY . .

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
RUN npm run deploy-kovan
RUN npm install

#Ignored by heroku
EXPOSE 5000

#Start app
CMD [ "npm", "start" ]
