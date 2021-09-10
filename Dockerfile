FROM node:16-alpine
WORKDIR /app
COPY package.json .
RUN npm install --legacy-peer-deps
COPY . .
RUN npm run build
RUN npm prune --production
EXPOSE 3000
CMD ["node", "./dist/main.js"]