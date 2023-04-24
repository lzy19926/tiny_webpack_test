# node为第0阶段，主要是实现前端包的安装及项目打包,容器内创建app文件夹,拷贝进去
FROM node
WORKDIR /app
COPY package*.json /app/
COPY . /app
# 不在镜像内install  而是在外部install,build好之后,将dist拷贝到容器内
# RUN npm install
# RUN npm run build

#  FROM nginx为第1阶段
#  --from=0表示把第一阶段构建完成的dist目录及我们之前添加的nginx.conf拷贝到nginx对应的目录中
FROM nginx
COPY --from=0 /app/dist /usr/share/nginx/html
COPY --from=0 /app/nginx.conf /etc/nginx/conf.d/default.conf