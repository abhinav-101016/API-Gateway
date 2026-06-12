FROM node
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY services/order ./services/order
EXPOSE 4003
CMD ["node", "services/order/index.js"]