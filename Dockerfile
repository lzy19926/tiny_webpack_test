FROM node
WORKDIR /app
COPY package*.json /app/
RUN npm install
COPY . /app
RUN npm run t-build

FROM nginx
COPY --from=0 /app/dist /usr/share/nginx/html
COPY --from=0 /app/nginx.conf /etc/nginx/conf.d/default.conf