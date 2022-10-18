import Ruzy from '../../../my_node_modules/lzy-Ruzy/out/index'

const store = new Ruzy()

store.initStates({
    name:'张三',
    age:18
})

export default store