FROM node
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY ./middleware ./middleware
COPY ./gateway ./gateway
COPY generateToken.js .

EXPOSE 3000
CMD ["node", "gateway/index.js"]    