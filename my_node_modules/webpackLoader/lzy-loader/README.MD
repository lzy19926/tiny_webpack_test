## LZY格式文件解析器   使用说明(需要配合babel-loader)
npm i lzy-loader  babel-loader @babel/core

### 在webpack的rules配置中添加
```tsx
    rules: [
            {
                test: /\.lzy$/,
                use: ['babel-loader', 'lzy-loader']
            }
    ]
```

## 创建  App.lzy 文件   语言模式设置为js 即可使用<LZY-TEMPLATE>标签


##  新增功能  可以在模板中使用 {( )} 包裹JS代码并执行