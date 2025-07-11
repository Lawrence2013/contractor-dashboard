FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build && npm prune --production
CMD ["node", "dist/index.js"]
EXPOSE 4000
