FROM node:20-slim

WORKDIR /app

COPY package.json /app/

RUN npm install

COPY . /app

RUN npm run build

FROM nginx:1.25-alpine
COPY --from=0 /app/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]