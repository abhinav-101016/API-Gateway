FROM node
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY services/user ./services/user
EXPOSE 4001
CMD ["node", "services/user/index.js"]