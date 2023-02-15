## 一个为Lzy-React专门设计的简易全局状态管理器
## 同时兼容React

使用方法

0. npm install lzy-ruzy
1. new Ruzy(...initStates)  
2. store.useState  
3. store.setState

~~~
// ----------创建一个store,初始化states
import Ruzy from 'lzy-ruzy'

export default new Ruzy({
    name: '张三',
    age: 18
})

// ------------页面
import store from './store'

function Child(){
    return (<div>age:{age} name:{name}</div>)
}

function App(){
    const { name, age } = store.useState('name', 'age')

    const addAge = () => { store.setState({ age: age + 1 })
    const changeName = () => { store.setState({ name: '李四' }) }

    return(
         <div>

            <button onClick={addAge}>全局age++</button>
            <button onClick={changeName}>全局name改变</button>

            <Child />
            <Child />
            <Child />
         </div>
    )
}

~~~