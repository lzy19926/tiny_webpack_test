"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetFiber = exports.updateRender = exports.render = void 0;
//! render分为2部分  render阶段 - commit阶段  最后unmount
const GlobalFiber_1 = require("./GlobalFiber");
const createFiberTree_1 = require("../myJSX/createFiberTree");
//! ----------------模拟render部分------------------------
//! 更改并生成fiber树  (结束后fiber由mount变为update)
function renderPart(functionComponent, initFiber) {
    //todo 如果initFiber是全局根节点 则首次处理App函数
    const { template, resource, rootFiberNode } = firstRenderApp(functionComponent, initFiber);
    //todo根据组件构建fiberTree(首次)
    const fiberTree = (0, createFiberTree_1.createFiberTree)(template, resource);
    rootFiberNode.children.push(fiberTree);
    return rootFiberNode;
}
//todo 获取上一次的fiberTree 执行所有打上tag的functionComponent进行state更新 再commit   
function updateRenderPart(functionComponent, rootFiber) {
    // 改变tag
    GlobalFiber_1.global.renderTag = 'update';
    // 处理根App节点
    const { template, resource, rootFiberNode } = firstUpdateRenderApp(functionComponent, rootFiber);
    // 更新函数组件(因为处理了根节点 从根节点的第一个子节点开始递归)
    const secondNode = rootFiberNode.children[0];
    // 此时不需要创建fiberNode  所以不需要添加childFiber  直接在根fiber树上更新
    (0, createFiberTree_1.updateFiberTree)(template, secondNode, resource);
    return rootFiberNode;
}
//对render根Fiber节点进行处理(否则无法渲染第一个根节点)
function firstRenderApp(functionComponent, initFiber) {
    const rootFiberNode = initFiber;
    GlobalFiber_1.global.currentFiberNode = rootFiberNode;
    rootFiberNode.stateNode = functionComponent;
    //! 用于解决webpack 函数名出现bound问题
    const functionNameArr = functionComponent.name.split(' ');
    let functionName = functionNameArr[0] === 'bound'
        ? functionNameArr[1]
        : functionNameArr[0];
    rootFiberNode.tag = functionName;
    const { template, data, components } = functionComponent();
    const resource = { data, components };
    rootFiberNode.fiberFlags = 'update';
    return { template, resource, rootFiberNode };
}
function firstUpdateRenderApp(functionComponent, fiber) {
    const rootFiberNode = fiber;
    GlobalFiber_1.global.currentFiberNode = rootFiberNode;
    rootFiberNode.stateNode = functionComponent;
    //! 用于解决webpack 函数名出现bound问题
    const functionNameArr = functionComponent.name.split(' ');
    let functionName = functionNameArr[0] === 'bound'
        ? functionNameArr[1]
        : functionNameArr[0];
    rootFiberNode.tag = functionName;
    const { template, data, components } = functionComponent();
    const resource = { data, components };
    rootFiberNode.fiberFlags = 'update';
    return { template, resource, rootFiberNode };
}
//! -----------------模拟Commit阶段-----------------------------
//! 分为三部分  beforeMutation  mutation  layout阶段
//! before 前置处理  mutation 渲染dom节点   layout  处理useEffect useLayoutEffect
function commitPart(fiber, rootDom) {
    // console.log('本次commit的fiber', fiber);
    //todo  mutation阶段
    removeHtml(rootDom);
    createHtml(fiber, rootDom); //根据fiberTree创建html
    //todo  layout阶段  调用Effects链表 执行create函数()
    handleEffect(fiber);
    //todo 处理ref
}
function updateCommitPart(fiber, rootDom) {
    //TODO  此时的fiber包含组件节点  rootDom包含组件节点
    // console.log('本次updateCommit的fiber', fiber);
    //todo  mutation阶段
    removeHtml(rootDom);
    updateHtml(fiber, rootDom); //根据fiberTree创建html
    //todo  layout阶段  调用Effects链表 执行create函数()
    handleEffect(fiber);
    //todo 处理ref
}
//! 清空子节点 换nodeList为数组 再循环清空
function removeHtml(rootDom) {
    //转换nodeList为数组
    const childDomArr = [].slice.apply(rootDom.childNodes);
    childDomArr.forEach((dom) => {
        rootDom.removeChild(dom);
    });
}
//! (从更新的rootDom处开始)根据fiberTree创建html
function createHtml(fiber, rootDom) {
    //不同的tag标签创建不同的html标签
    let dom = document.createElement(fiber.tag);
    //todo 如果是组件节点   挂载ref 
    if (fiber.tag[0] === fiber.tag[0].toUpperCase()) {
        dom = document.createElement('fc-' + fiber.tag);
        fiber.ref = dom;
        //todo 如果是小写 判断为html标签 填充文本 处理属性
    }
    else {
        handleProps(fiber, dom);
        if (fiber.text) {
            dom.innerHTML = fiber.text;
        }
    }
    //todo 深度优先递归children 从dom开始渲染子dom节点 
    fiber.children.forEach((fiber) => {
        createHtml(fiber, dom);
    });
    rootDom.appendChild(dom);
}
function updateHtml(fiber, rootDom) {
    //todo 深度优先递归children 从dom下一层渲染子dom节点 
    fiber.children.forEach((fiber) => {
        createHtml(fiber, rootDom);
    });
}
//! 对标签中的属性进行处理 给dom节点添加标签 (未完成)
function handleProps(curFiber, dom) {
    const props = curFiber.props;
    for (let key in props) {
        const value = props[key];
        switch (key) {
            //todo  处理className (合并所有的类名)
            case 'className':
                let classNameStr = '';
                for (let i = 0; i < value.length; i++) {
                    classNameStr += value[i] + ' ';
                }
                dom.setAttribute("class", classNameStr.trim());
                break;
            //todo  处理class (合并所有的类名)
            case 'class':
                let classStr = '';
                for (let i = 0; i < value.length; i++) {
                    classStr += value[i] + ' ';
                }
                dom.setAttribute("class", classStr.trim());
                break;
            //todo  处理点击事件
            case 'onClick':
                //! 从组件的资源池里找对应的事件
                const dataPool = curFiber.sourcePool.data;
                const callback = dataPool[value[0]];
                dom.addEventListener("click", callback);
                break;
            //todo  处理其他
            default:
                dom.setAttribute(key, value[0]);
                break;
        }
    }
}
//! 遍历树获取所有的Effect(执行create和生成destory函数数组)
function handleEffect(fiber) {
    let destoryEffectsArr = [];
    if (fiber.updateQueue) {
        const createEffectsArr = createCallbackQueue(fiber);
        destoryEffectsArr = doCreateQueue(createEffectsArr);
    }
    if (fiber.children.length !== 0) {
        fiber.children.forEach((fiber) => {
            handleEffect(fiber);
        });
    }
    GlobalFiber_1.global.destoryEffectsArr.push(...destoryEffectsArr);
}
//todo 遍历Effect链表 将需要执行的Effect推入数组--------------
function createCallbackQueue(fiber) {
    const createEffectsArr = [];
    const lastEffect = fiber.updateQueue.lastEffect;
    const firstEffect = lastEffect.next;
    let currentEffect = firstEffect;
    do {
        //判断effectTag决定是否执行Effect(mount和dep变更时执行)
        //React底层通过二进制来打tag
        const isFiberMount = Boolean(GlobalFiber_1.global.renderTag === 'mount');
        const isDepChange = Boolean(currentEffect.tag === 'depChanged');
        const isNullDeps = Boolean(currentEffect.tag === 'nullDeps');
        const isNoDeps = Boolean(currentEffect.tag === 'noDeps');
        //根据不同情况 将Effect推入数组  达到不同的useEffect的效果
        if (isFiberMount || isDepChange || isNullDeps) {
            createEffectsArr.push(currentEffect);
        }
        else if (isFiberMount && isNoDeps) {
            createEffectsArr.push(currentEffect);
        }
        currentEffect = currentEffect.next;
    } while (currentEffect !== firstEffect);
    return createEffectsArr;
}
//todo 遍历执行需要执行的Effect---生成destory---------
function doCreateQueue(createEffectsArr) {
    const destoryEffectsArr = [];
    //todo 遍历Effects数组 执行create  
    //todo 生成destoryEffect数组 将destory存放到对应的Effect上
    for (let i = 0; i < createEffectsArr.length; i++) {
        const destory = createEffectsArr[i].create(); // 执行create
        if (destory) {
            createEffectsArr[i].destory = destory; // 赋值destory
            destoryEffectsArr.push(createEffectsArr[i]); //推入destory数组
        }
    }
    return destoryEffectsArr;
}
//! ----------模拟unmount阶段(暂时不需要) -------------------------
//todo  清空上一次执行完的updateQueue 重置HookIndex 执行distory函数数组
function unmountPart() {
    // 注意 这里并不是真实的unmount阶段  所以不会执行destoryQueue 
    // doDestoryQueue(global.destoryEffectsArr)
    // resetFiber(global.rootFiber)
}
//todo -----在unmounted时执行destorys数组
function doDestoryQueue(destoryEffectsArr) {
    for (let i = 0; i < destoryEffectsArr.length; i++) {
        const destory = destoryEffectsArr[i].destory;
        if (destory) {
            destory();
        }
    }
}
//todo ----遍历清空fiber树上的hookIndex 和 queue
function resetFiber(fiberTree) {
    fiberTree.hookIndex = 0;
    fiberTree.updateQueue = null;
    GlobalFiber_1.global.destoryEffectsArr = [];
    if (fiberTree.children.length !== 0) {
        fiberTree.children.forEach((fiber) => {
            resetFiber(fiber);
        });
    }
}
exports.resetFiber = resetFiber;
//!--------------综合Render方法-------------------
function render(functionComponent, rootDom, initFiber) {
    console.log('------------render-------------');
    //用于适配路由  需要从该fiber节点开始render
    if (!initFiber) {
        initFiber = GlobalFiber_1.global.rootFiber;
    }
    const fiber = renderPart(functionComponent, initFiber); //todo render阶段
    // commitPart(fiber, rootDom)//todo commit阶段
}
exports.render = render;
function updateRender(functionComponent, rootDom, rootFiber) {
    console.time('updateRender');
    //更新render时需要先将fiber的数据重置  重新挂载数据
    resetFiber(rootFiber);
    console.log('------------updateRender-------------');
    const newFiber = updateRenderPart(functionComponent, rootFiber);
    updateCommitPart(newFiber, rootDom); //todo commit阶段
    console.timeEnd('updateRender');
}
exports.updateRender = updateRender;
