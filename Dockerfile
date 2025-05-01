# Build Stage
FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 80
ENV GOOGLE_NODE_RUN_SCRIPTS: ''
ENV NODE_ENV: 'production'
CMD ["npm", "run", "start"]