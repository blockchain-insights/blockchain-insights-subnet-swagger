FROM node:18-alpine AS base

COPY . .

RUN npm install
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]