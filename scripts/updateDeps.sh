#!/bin/bash
# 一键更新所有的lzy相关依赖(删除后再从my_node_modules导入)
nrm use taobao

cd E:\\My_Webpack\\myWebpack

npm uninstall lzy-ui
npm install .\\my_node_modules\\lzy-LzyUI\\

npm uninstall lzy-microapp
npm install .\\my_node_modules\\lzy-microApp\\

npm uninstall lzy-qiankun
npm install .\\my_node_modules\\lzy-Qiankun\\

npm uninstall lzy-react
npm install .\\my_node_modules\\lzy-React\\

npm uninstall lzy-react-query
npm install .\\my_node_modules\\lzy-React-Query\\

npm uninstall lzy-react-router
npm install .\\my_node_modules\\lzy-React-Router\\

npm uninstall lzy-ruzy
npm install .\\my_node_modules\\lzy-Ruzy\\

npm uninstall lzy-ruzy-react
npm install .\\my_node_modules\\lzy-ruzy-react\\

npm uninstall lzy-webpack
npm install .\\my_node_modules\\lzy-webpack\\

npm uninstall lzy-formatjs
npm install .\\my_node_modules\\lzy-FormatJS\\

nrm use npm