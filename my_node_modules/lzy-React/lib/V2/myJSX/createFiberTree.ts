import { FiberNode, global } from '../myReactCore/GlobalFiber'
import { ElementNode, TextElementNode } from "../myReactCore/Interface";
import { transformElementTreeToBinadyTree } from '../myJSX/createElement'

//! ---------------初始创建fiberTree--------------------
export function createFiberTree(elementNode: ElementNode | TextElementNode, parentFiber: FiberNode): FiberNode {
    let newFiberNode = new FiberNode('mount', '$1')
    let childElement = elementNode._child
    let siblingElement = elementNode._sibling

    //todo 切换当前工作fiber
    global.workInprogressFiberNode = newFiberNode

    newFiberNode.tag = elementNode.tag
    newFiberNode._parent = parentFiber
    newFiberNode._element = elementNode
    elementNode.fiber = newFiberNode


    //如果tag大写 解析为FC组件节点 重新生成element  挂载props
    if (elementNode.tag[0] === elementNode.tag[0].toUpperCase()) {
        newFiberNode.nodeType = 'FunctionComponent'
        newFiberNode.stateNode = elementNode.ref
        const childElementTree = elementNode.ref.call(undefined, elementNode.props)    //! 挂载props
        childElement = transformElementTreeToBinadyTree(childElementTree, elementNode) //! 重新生成新的二叉element树
        elementNode._child = childElement
    }
    //解析为text节点
    else if (elementNode.tag === 'text') {
        newFiberNode.nodeType = 'HostText'
        newFiberNode.text = elementNode.text
        createTextElement(newFiberNode)
    }
    //解析为普通dom节点
    else {
        newFiberNode.nodeType = 'HostComponent'
        createDomElement(newFiberNode)
    }




    // 深度优先递归执行
    if (childElement) {
        const childFiber = createFiberTree(childElement, newFiberNode)
        newFiberNode._child = childFiber
    }
    if (siblingElement) {
        const siblingFiber = createFiberTree(siblingElement, parentFiber)
        newFiberNode._sibling = siblingFiber
    }

    // 更改状态
    newFiberNode.fiberFlags = 'update'


    return newFiberNode
}

//! -------------创建复制的alternate------------------
export function createAlternate(currentFiber: FiberNode): FiberNode {
    let alternateFiber = new FiberNode('mount', '$2')
    let child = currentFiber._child
    let sibling = currentFiber._sibling

    //! 将一些属性复制给workInProgress
    alternateFiber.stateQueueTimer = currentFiber.stateQueueTimer
    alternateFiber.updateQueue = currentFiber.updateQueue
    alternateFiber.hookIndex = currentFiber.hookIndex
    alternateFiber.memorizedState = currentFiber.memorizedState
    alternateFiber.nodeType = currentFiber.nodeType
    alternateFiber.tag = currentFiber.tag
    alternateFiber.text = currentFiber.text
    //! 链接两个fiber 
    alternateFiber.alternate = currentFiber
    currentFiber.alternate = alternateFiber
    //! 链接parent
    if (currentFiber._parent) {
        alternateFiber._parent = currentFiber._parent.alternate
        currentFiber._parent.alternate = alternateFiber._parent
    }

    // 深度优先递归执行
    if (child) {
        const childAlternateFiber = createAlternate(child)
        alternateFiber._child = childAlternateFiber
    }
    if (sibling) {
        const siblingAlternateFiber = createAlternate(sibling)
        alternateFiber._sibling = siblingAlternateFiber
    }

    // 更改状态
    alternateFiber.fiberFlags = 'update'

    return alternateFiber
}

//! -------------创建html并挂载到fiber节点上--------------------
export function createDomElement(fiber: FiberNode) {
    //找到父dom节点 将创建好的dom节点添加进去
    const parentDom = getParentDom(fiber)

    let domElement = document.createElement(fiber.tag)
    handleProps(fiber, domElement)
    parentDom.appendChild(domElement)
    fiber.stateNode = domElement

    return domElement
}

//! -------------创建text节点并挂载到fiber节点上--------------------
export function createTextElement(fiber: FiberNode) {
    //找到父dom节点 将创建好的dom节点添加进去
    const parentDom = getParentDom(fiber)

    let textElement = document.createTextNode(fiber.text)
    parentDom.appendChild(textElement)
    fiber.stateNode = textElement

    return textElement
}

//! ----------找到父dom节点---------------------
function getParentDom(fiber: FiberNode) {

    let parentNode = fiber._parent
    let parentDom = parentNode?.stateNode

    if (!parentNode) {
        return document.getElementById('root')
    }

    while (typeof parentDom === 'function') {
        parentNode = parentNode._parent
        if (!parentNode) {
            return document.getElementById('root')
        }
        parentDom = parentNode.stateNode
    }


    return parentDom
}

//! 对标签中的属性进行处理 给dom节点添加标签 (未完成)
export function handleProps(fiber: FiberNode, dom: HTMLElement | any) {

    const props = fiber._element.props

    for (let key in props) {
        const value = props[key]
        switch (key) {
            //todo  处理className 
            case 'className':
                dom.setAttribute("class", value);
                break;

            //todo  处理class
            case 'class':
                dom.setAttribute("class", value);
                break;

            //todo  处理点击事件(还需处理其他事件)
            case 'onClick':
                dom.onclick = value
                break;

            //todo  处理其他
            default:
                dom.setAttribute(key, value);
                break;
        }
    }
}











//todo 深度优先遍历  优先进入child  再进入sibling 都无的情况返回parent 进入sibling （交替执行begin和completeWork）
export function createFiberWorkLoop2(elementNode: ElementNode | TextElementNode) {

    if (Symbol.keyFor(elementNode.$$typeof) === 'textElement') {
        console.log('执行completeWork', elementNode.$$typeof);
        if (elementNode._child) {
            createFiberWorkLoop(elementNode._child)
        }
        if (elementNode._sibling) {
            createFiberWorkLoop(elementNode._sibling)
        }
    }


    else {
        console.log('执行beginWork', elementNode.$$typeof);
        if (elementNode._child) {
            createFiberWorkLoop(elementNode._child)
        }
        if (elementNode._sibling) {
            createFiberWorkLoop(elementNode._sibling)
        }
        console.log('执行completeWork', elementNode.$$typeof);
    }



}

//todo 深度优先遍历  构建fiber树
export function createFiberWorkLoop(elementNode: ElementNode | TextElementNode) {

    console.log('执行beginWork', elementNode.$$typeof);

    if (elementNode._child) {
        console.log('进入child');
        createFiberWorkLoop(elementNode._child)
    }
    if (elementNode._sibling) {
        console.log('进入sibling');
        createFiberWorkLoop(elementNode._sibling)
    }

}


function test() {
    const obj = {
        $$typeof: Symbol('lzyElement'),
        tag: "div",
        props: null,
        children: [
            {
                $$typeof: Symbol('lzyElement'),
                tag: "div",
                props: {
                    id: 1,
                    name: "张三"
                },
                children: [
                    {
                        $$typeof: Symbol('lzyTextElement'),
                        text: "文字内容"
                    },
                    {
                        $$typeof: Symbol('lzyElement'),
                        tag: "div",
                        props: {
                            id: 1,
                            name: "张三"
                        },
                        children: [
                            {
                                text: "1"
                            }
                        ]
                    },
                    {
                        $$typeof: Symbol('lzyElement'),
                        tag: "div",
                        props: {
                            id: 1,
                            name: "张三"
                        },
                        children: [
                            {
                                text: "1"
                            }
                        ]
                    },
                    {
                        $$typeof: Symbol('lzyElement'),
                        tag: "div",
                        props: null,
                        children: [
                            {
                                text: "Child"
                            }
                        ]
                    }
                ]
            }
        ]
    }
    console.log(transformElementTreeToBinadyTree(obj, 1));
}

