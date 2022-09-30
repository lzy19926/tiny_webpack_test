## lzy-react适配的路由  测试环节  需要整体重构  凑合用吧
```tsx
import {RouteContainer,Link} from 'lzy-react-route'

        // 路由占位符  路由页面会显示在这里
        <Route></Route>


        // 使用Link标签  点击跳转
        // 注意 传入的组件同样要在data里注册
        <Link to="/" component={RekvTest} title='跳转Rekv(重定向)'></Link>
        <Link to="#rekvTest" component={RekvTest} title='跳转Rekv页面'></Link>
        <Link to="#demo" component={Demo} title='跳转Demo页面'></Link>

```

### 注意: 组件暂时不完全支持children写法 
### 注意  传入的组件同样要在data里注册
### 注意  路由依赖于lzy-react包
