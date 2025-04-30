# Build Stage
FROM node:22-alpine AS build
ENV NODE_ENV="prod"
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 80
CMD ["npm", "run", "start"]