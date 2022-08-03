import { FiberNode } from './Interface'
import { global } from './GlobalFiber'
import { tplToVDOM } from '../myJSX/tplToVnode'




//!--------------综合Render方法-------------------
function linkRender(functionComponent: Function, rootDom: any, initFiber?: FiberNode): any {

    console.log('------------LinkRender-------------');

    //用于适配路由  需要从该fiber节点开始render
    if (!initFiber) {
        initFiber = global.rootFiber
    }

    const fiber = linkRenderPart(functionComponent, initFiber)//todo render阶段


    linkCommitPart(fiber, rootDom)//todo commit阶段

}



function linkRenderPart(functionComponent: Function, initFiber: FiberNode) {

    //todo 如果initFiber是全局根节点 则首次处理App函数
    const { template, resource, rootFiberNode } = firstRenderApp(functionComponent, initFiber)

    //todo根据组件构建fiberTree(首次)
    const fiberTree = createFiberTree(template, resource)

    //!!!!链接链表
    rootFiberNode.next = fiberTree
    fiberTree.parentFiberNode = rootFiberNode

    return rootFiberNode

}


//对render根Fiber节点进行处理(否则无法渲染第一个根节点)
function firstRenderApp(functionComponent: Function, initFiber: FiberNode) {
    const rootFiberNode = initFiber
    global.currentFiberNode = rootFiberNode
    rootFiberNode.stateNode = functionComponent


    //! 用于解决webpack 函数名出现bound问题
    const functionNameArr = functionComponent.name.split(' ')
    let functionName = functionNameArr[0] === 'bound'
        ? functionNameArr[1]
        : functionNameArr[0]

    rootFiberNode.tag = functionName


    const { template, data, components } = functionComponent()
    const resource = { data, components }

    rootFiberNode.fiberFlags = 'update'

    return { template, resource, rootFiberNode }
}




function createFiberTree(source: any, resources: any) {

    //todo 创建一个新的fiber节点 
    let newFiberTree: FiberNode = {
        memorizedState: null,// fiber上的所有hook链表(正在执行的hook会进入workInProgressHook)
        stateNode: () => { },    // 对应的函数组件
        updateQueue: null, // Effects的更新链表
        stateQueueTimer: null,
        fiberFlags: 'mount',// fiber的生命周期 判断是否初始化
        hasRef: false,//ref相关tag
        ref: null,
        children: [],
        props: null,
        tag: null,
        text: null,
        sourcePool: null,
        hookIndex: 0, // 用于记录hook的数量 以便查找
        parentFiberNode: null, // 父级节点
        next: null //! 初始化next
    }
    //todo 当前工作节点变为这个
    global.currentFiberNode = newFiberTree



    //todo 判断传入的source 转换成vnode
    let vnode = typeof source === 'string'
        ? tplToVDOM(source)
        : source

    //合并vnode和Fiber 挂载resource
    const { children = [], props, tag, text } = vnode
    newFiberTree.props = props
    newFiberTree.tag = tag
    newFiberTree.text = text
    newFiberTree.sourcePool = resources


    //todo  当前节点  next拼接
    let currentFiber = newFiberTree


    //TODO -----------如果tag大写 解析为组件 ----------------
    if (tag[0] === tag[0].toUpperCase()) {

        //todo 从sourcePool中获取子组件
        const fc = newFiberTree.sourcePool.components[tag]
        if (!fc) { console.error(`子组件${tag}未注册`) }

        //! 从资源池中拿取需要的props，给子函数组件绑定需要的props,并挂载子函数组件到fiber上

        handleFunctionComponentProps(newFiberTree, fc)

        //! 需要在这里执行fc 挂载hooks 生成新的resource
        const { template, data = {}, components = {} } = newFiberTree.stateNode()

        const resources = { data, components }

        // ! 渲染组件子fiber树 (sourcePool仅保存了父组件返回的数据)   
        //!!!!!!!!!修改部分  接入下一个fiber节点  
        currentFiber.next = createFiberTree(template, resources)
    }

    //TODO ------------单fiber节点处理结束  更改flag
    newFiberTree.fiberFlags = 'update'


    //!!!! 有children的情况  将子节点继续接入next
    if (children) {
        for (let i = 0; i < children.length; i++) {
            const nextFiber = createFiberTree(children[i], currentFiber.sourcePool)
            nextFiber.parentFiberNode = newFiberTree
            currentFiber.next = nextFiber
            currentFiber = nextFiber
        }
    }

    //todo  如果是Route组件 将container的fiber传递给子组件 (暂时放到全局)
    //! 用于适配路由
    if (newFiberTree.tag === 'RouteContainer') {
        window.$$routeContainerFiber = newFiberTree
    }

    return newFiberTree
}





//todo commit
function linkCommitPart(fiber: FiberNode, rootDom: HTMLBodyElement) {

    console.log('本次commit的链式fiber', fiber);

    //todo  mutation阶段
    removeHtml(rootDom)

    createHtml(fiber, rootDom)//根据fiberTree创建html

    //todo  layout阶段  调用Effects链表 执行create函数()
    // handleEffect(fiber)

    //todo 处理ref
}


//! 清空子节点 换nodeList为数组 再循环清空
function removeHtml(rootDom: HTMLBodyElement) {

    //转换nodeList为数组
    const childDomArr = [].slice.apply(rootDom.childNodes)

    childDomArr.forEach((dom) => {
        rootDom.removeChild(dom)
    })

}



//! (从更新的rootDom处开始)根据fiberTree创建html
let parentDom;
function createHtml(fiber: any, rootDom: HTMLBodyElement) {

    //不同的tag标签创建不同的html标签
    let dom = document.createElement(fiber.tag)



    //如果这个节点是其next的父节点 则设置dom为parentDom

    if (fiber.next && fiber.next.parentFiberNode === fiber) {


        //todo 如果是组件节点   挂载ref 
        if (fiber.tag[0] === fiber.tag[0].toUpperCase()) {
            dom = document.createElement('fc-' + fiber.tag)
            fiber.ref = dom
            //todo 如果是小写 判断为html标签 填充文本 处理属性
        }
        else {
            handleProps(fiber, dom)
            if (fiber.text) { dom.innerHTML = fiber.text }
        }

        parentDom = dom

        rootDom.appendChild(dom)
        if (fiber.next) { createHtml(fiber.next, parentDom) }
    }






    else if (fiber.next && fiber.next.parentFiberNode !== fiber) {


        //todo 如果是组件节点   挂载ref 
        if (fiber.tag[0] === fiber.tag[0].toUpperCase()) {
            dom = document.createElement('fc-' + fiber.tag)
            fiber.ref = dom
            //todo 如果是小写 判断为html标签 填充文本 处理属性
        }
        else {
            handleProps(fiber, dom)
            if (fiber.text) { dom.innerHTML = fiber.text }
        }


        parentDom.appendChild(dom)
        if (fiber.next) { createHtml(fiber.next, dom) }
    }






    else if (!fiber.next) {

        //todo 如果是组件节点   挂载ref 
        if (fiber.tag[0] === fiber.tag[0].toUpperCase()) {
            dom = document.createElement('fc-' + fiber.tag)
            fiber.ref = dom
            //todo 如果是小写 判断为html标签 填充文本 处理属性
        }
        else {
            handleProps(fiber, dom)
            if (fiber.text) { dom.innerHTML = fiber.text }
        }


        parentDom.appendChild(dom)

    }







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
                dom.addEventListener("click", callback);
                break;

            //todo  处理其他
            default:
                dom.setAttribute(key, value[0]);
                break;
        }
    }
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


export { linkRender }