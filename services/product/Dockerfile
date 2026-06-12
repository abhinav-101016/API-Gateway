FROM node
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY services/product ./services/product
EXPOSE 4002
CMD ["node", "services/product/index.js"]