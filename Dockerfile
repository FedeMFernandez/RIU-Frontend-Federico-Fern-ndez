# Node 18.19.1 Alpine
FROM node:18.19.1-alpine as build

RUN mkdir -p /app
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . /app
RUN npm run build --configuration=prod

# Nginx 1.26.3 (Stable) Alpine
FROM nginx:1.26.3-alpine

COPY --from=build /app/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/challenge/browser /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
