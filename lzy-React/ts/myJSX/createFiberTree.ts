import { tplToVDOM } from "./tplToVnode";
import { global, NewFiberNode } from '../myReactCore/GlobalFiber'
import { FiberNode } from "../myReactCore/Interface";


//! 创建fiberNode树(Vnode树) 深度优先遍历vnode树  包装成fiberNode
//! 根据fiberNode和FunctionComponent创建FiberNode 生成Fiber树
//todo 传入parentNode 给子fiber挂载parentNode属性  用于向上查找dom节点和fiber
function createFiberTree(source: any, resources: any, parentNode: FiberNode) {

    //todo 创建一个新的fiber节点(浅拷贝) 更新当前工作节点
    let newFiberNode = new NewFiberNode('mount', '$1')

    //todo 预处理Fiber  生成vnode 挂载resource
    const { children, tag } = preHandleFiberNode(source, resources, newFiberNode)

    //todo 挂载父节点
    newFiberNode.parentNode = parentNode

    //TODO -----------如果tag大写 解析为组件节点(无children) ----------------
    if (tag[0] === tag[0].toUpperCase()) {
        //! 处理为组件节点   并继续向下递归render子函数组件
        handleFunctionFiberNode(newFiberNode, tag)

        renderFunctionComponent(newFiberNode)
    }

    //TODO ----------小写的情况  是domComponent节点/text节点  创建对应的dom并添加--------
    else {
        newFiberNode.nodeType = 'HostText'
        createDomElement(newFiberNode)

    }

    //todo 继续向下深度优先递归  创建子fiber 挂到当前节点
    createFiberTreeLoop(children, newFiberNode)

    newFiberNode.fiberFlags = 'update'

    //模拟finishowrk
    // console.log('finishWork', newFiberNode.tag);

    //适配路由
    useRoute(newFiberNode)

    return newFiberNode
}

//! 根据子vnode 递归创建子fiberNode 并进行拼接-------------
function createFiberTreeLoop(childVnodes: any, parentNode: FiberNode) {
    if (childVnodes.length > 0) {
        parentNode.nodeType = 'HostComponent'
        for (let i = 0; i < childVnodes.length; i++) {
            const childFiberNode = createFiberTree(childVnodes[i], parentNode.sourcePool, parentNode)
            parentNode.children.push(childFiberNode)
        }
    }
}

//! -----------------render子函数组件-----------------------
function renderFunctionComponent(fiber: FiberNode) {

    if (typeof fiber.stateNode !== 'function') return

    const { template, data, components } = fiber.stateNode()

    const childFiberNode = createFiberTree(template, { data, components }, fiber)
    //todo 生成子树并链接
    fiber.children = [childFiberNode]

}

//! -------------创建html并挂载到fiber节点上--------------------
function createDomElement(fiber: FiberNode) {
    //找到父dom节点 将创建好的dom节点添加进去
    const parentDom = getParentDom(fiber)

    let domElement = document.createElement(fiber.tag)
    handleProps(fiber, domElement)
    if (fiber.text) { domElement.innerHTML = fiber.text }


    parentDom.appendChild(domElement)
    fiber.stateNode = domElement
    return domElement
}




//! 预处理FiberNode  将模板和资源先挂载到节点上-----------------
function preHandleFiberNode(source: any, resources: any, workInProgressFiber: FiberNode) {
    //todo 切换当前工作fiber
    global.workInprogressFiberNode = workInProgressFiber

    //todo 判断传入的source 转换成vnode
    let vnode = typeof source === 'string' ? tplToVDOM(source) : source

    //todo 合并处理vnode和Fiber 挂载resource
    const { children = [], tag } = vnode
    conbineVnodAndFiber(workInProgressFiber, vnode, resources)

    return { children, tag }
}

//! 处理函数组件节点
function handleFunctionFiberNode(fiber: FiberNode, ComponentName: string) {
    fiber.nodeType = 'FunctionComponent'
    //todo 从sourcePool中获取子组件
    const fc = fiber.sourcePool.components[ComponentName]
    if (!fc) { console.error(`子组件${ComponentName}未注册`) }
    //! 从资源池中拿取需要的props，给子函数组件绑定需要的props,并挂载子函数组件到fiber上
    handleFunctionComponentProps(fiber, fc)
}




//! ----------合并vnode和fiber 处理key 挂载resource-----------
function conbineVnodAndFiber(fiber: FiberNode, vnode: any, resources: any) {
    const { props, tag, text } = vnode
    fiber.props = props
    fiber.tag = tag
    fiber.text = text
    fiber.sourcePool = resources

    //单独对key进行处理
    if (props.key) {
        const key = props.key[0] - 0
        fiber.key = key
    }

}

//! ----------找到父dom节点---------------------
function getParentDom(fiber: FiberNode) {

    let parentNode = fiber.parentNode
    let parentDom = parentNode.stateNode

    if (!parentNode) {
        return document.getElementById('root')
    }

    while (typeof parentDom === 'function') {
        parentNode = parentNode.parentNode
        if (!parentNode) {
            return document.getElementById('root')
        }
        parentDom = parentNode.stateNode
    }


    return parentDom
}

//! ------------从资源池中拿取子组件需要的Props 处理后传递给子组件----------
//! 将props设置为单向数据流   并返回处理好的子组件函数传递出去
function handleFunctionComponentProps(fiber, functionComponent) {

    const needProps = fiber.props
    const data = fiber.sourcePool.data
    //否则对其他组件进行处理
    const nextProps = {}

    for (let key in needProps) {

        const originValue = needProps[key][0]
        let value: any;
        //! 对传入的props进行数据类型解析
        if (data[originValue]) { //从需求池中找到了对应的数据

            value = data[originValue]
        } else if (!isNaN((originValue - 0))) {//传入数字

            value = originValue - 0
        } else if (originValue[0] === '"' || originValue[0] === "'") {    //传入字符串

            value = originValue.slice(1, originValue.length - 1).trim()
        } else {// 传入普通字符串

            value = originValue
        }

        nextProps[key] = value
    }



    //todo 使用Objdect.defineoroperty包装props为只读(get set方法)
    //todo 定义一个新对象  添加对应的属性并添加描述器get set 
    const newProps = {}

    for (let key in nextProps) {
        let val = nextProps[key] // 设置该属性的初始值
        Object.defineProperty(newProps, key, {
            get: () => val, //访问时获取对应属性
            set: (newVal) => {
                console.warn('您正在尝试修改props, 不推荐此操作, 请保证数据单向流动')
                val = newVal // 修改时修改属性
            }
        })

    }


    //给函数组件绑定newProps  挂载到fiber上
    const newFc = functionComponent.bind(null, newProps)

    fiber.stateNode = newFc

    return newFc
}

//! 对标签中的属性进行处理 给dom节点添加标签 (未完成)
function handleProps(curFiber: any, dom: any) {

    const props = curFiber.props

    for (let key in props) {
        const value = props[key]
        switch (key) {
            //todo  处理className (合并所有的类名)
            case 'className':
                let classNameStr = ''
                for (let i = 0; i < value.length; i++) {
                    classNameStr += value[i] + ' '
                }
                dom.setAttribute("class", classNameStr.trim());
                break;

            //todo  处理class (合并所有的类名)
            case 'class':
                let classStr = ''
                for (let i = 0; i < value.length; i++) {
                    classStr += value[i] + ' '
                }
                dom.setAttribute("class", classStr.trim());
                break;

            //todo  处理点击事件
            case 'onClick':
                //! 从组件的资源池里找对应的事件
                const dataPool = curFiber.sourcePool.data
                const callback = dataPool[value[0]]
                dom.onclick = callback
                break;

            //todo  处理其他
            default:
                dom.setAttribute(key, value[0]);
                break;
        }
    }
}

//! -------路由适配方法  待修改---------------------
function useRoute(fiber: FiberNode) {
    //todo  如果是Route组件 将container的fiber传递给子组件 (暂时放到全局)

    if (fiber.tag === 'RouteContainer') {
        window.$$routeContainerFiber = fiber
    }
}



export {
    createFiberTree,
    renderFunctionComponent,
    useRoute,
    handleProps,
    handleFunctionComponentProps,
    createDomElement,
    getParentDom,
    conbineVnodAndFiber,
    preHandleFiberNode,
    handleFunctionFiberNode
}



// 错误记录
// 函数name被webpack打包后会变为bound+函数名
// 不能直接给tag赋值 



//! -------------废弃部分------------------------------
{
    // //这个应该在commit阶段执行
    // function updateDomElement(fiber: FiberNode) {

    //     let domElement = fiber.stateNode
    //     handleProps(fiber, domElement)
    //     if (fiber.text) { domElement.innerHTML = fiber.text }

    //     return domElement
    // }
}