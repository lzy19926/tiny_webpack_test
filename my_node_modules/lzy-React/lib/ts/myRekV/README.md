
## 基本使用
```tsx
// 创建全局store (可创建多个不同的store)  在allStates中初始化状态
const store = new Rekv({allStates:{
    name:'张三',
    age:18,
}})

//从store中获取属性
const { name,age } = store.useState(['name','age'])

// 修改store中的全局状态 所有组件中的状态都会更新
store.setState({age:age+1})
```


### 补充说明
```tsx
// 重新适配了useEffect钩子  全局状态可作为依赖项
myUseEffect(()=>{
    console.log('全局状态age发生变化')
},[age])
```







