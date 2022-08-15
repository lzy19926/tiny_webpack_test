"use strict";
//待办项
// 将fiber树转换为二叉树
// 模拟优先级调度逻辑   拆分effect链表执行
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetFiber = exports.updateRender = exports.render = void 0;
//! render分为2部分  render阶段 - commit阶段  最后unmount
const GlobalFiber_1 = require("./GlobalFiber");
const createFiberTree_1 = require("../myJSX/createFiberTree");
const updateFiberTree_1 = require("../myJSX/updateFiberTree");
const Reconciler_1 = require("./Reconciler");
//! ----------------模拟render部分------------------------
//! 更改并生成fiber树  (结束后fiber由mount变为update)
function renderPart(functionComponent, rootDom, workInProgress) {
    //todo 通过functionComponents生成第一个组件节点 如App
    const { template, resource, currentRootFiber } = firstRenderApp(functionComponent, workInProgress, rootDom);
    //todo根据组件构建fiberTree(首次)
    const fiberTree = (0, createFiberTree_1.createFiberTree)(template, resource, currentRootFiber);
    currentRootFiber.children.push(fiberTree);
    return currentRootFiber;
}
//todo 获取上一次的fiberTree 执行所有打上tag的functionComponent进行state更新 再commit   
function updateRenderPart(functionComponent, workInProgressFiber, currentFiber) {
    // 改变tag
    GlobalFiber_1.global.renderTag = 'update';
    // 处理根App节点 并链接两个节点
    const { template, resource, workInProgressRootFiber } = firstUpdateRenderApp(functionComponent, workInProgressFiber, currentFiber);
    // 更新函数组件(因为处理了根节点 从根节点的第一个子节点开始递归)
    const secondWorkInProgress = workInProgressRootFiber.children[0];
    const secondCurrent = currentFiber.children[0];
    // 此时不需要创建fiberNode  所以不需要添加childFiber  直接在根fiber树上更新
    const childFiber = (0, updateFiberTree_1.updateFiberTree)(template, resource, workInProgressRootFiber, secondWorkInProgress, secondCurrent);
    if (workInProgressRootFiber.children.length === 0) {
        workInProgressRootFiber.children = [childFiber];
    }
    return workInProgressRootFiber;
}
//todo修补用工具函数对render根Fiber节点进行处理(否则无法渲染第一个根节点)
function firstRenderApp(functionComponent, currentRootFiber, rootDom) {
    GlobalFiber_1.global.workInprogressFiberNode = currentRootFiber;
    currentRootFiber.stateNode = functionComponent;
    currentRootFiber.nodeType = 'AppNode';
    //! 用于解决webpack 函数名出现bound问题 并赋值给此fiber的tag
    const functionNameArr = functionComponent.name.split(' ');
    currentRootFiber.tag = functionNameArr[0] === 'bound'
        ? functionNameArr[1]
        : functionNameArr[0];
    //! 处理向下传递的resource
    const { template, data, components } = functionComponent();
    const resource = { data, components };
    currentRootFiber.fiberFlags = 'update';
    return { template, resource, currentRootFiber };
}
function firstUpdateRenderApp(functionComponent, workInProgressRootFiber, currentRootFiber) {
    if (!workInProgressRootFiber) {
        workInProgressRootFiber = firstCreateAlternate(currentRootFiber);
    }
    GlobalFiber_1.global.workInprogressFiberNode = workInProgressRootFiber;
    workInProgressRootFiber.stateNode = functionComponent;
    //! 用于解决webpack 函数名出现bound问题
    const functionNameArr = functionComponent.name.split(' ');
    let functionName = functionNameArr[0] === 'bound'
        ? functionNameArr[1]
        : functionNameArr[0];
    workInProgressRootFiber.tag = functionName;
    const { template, data, components } = functionComponent();
    const resource = { data, components };
    return { template, resource, workInProgressRootFiber };
}
function firstCreateAlternate(currentRootFiber) {
    //todo 新建一个fiberNode
    const workInProgressRootFiber = new GlobalFiber_1.NewFiberNode('update', '$2');
    //! 复制一些通用属性
    workInProgressRootFiber.stateQueueTimer = currentRootFiber.stateQueueTimer;
    workInProgressRootFiber.updateQueue = currentRootFiber.updateQueue;
    workInProgressRootFiber.hookIndex = currentRootFiber.hookIndex;
    workInProgressRootFiber.memorizedState = currentRootFiber.memorizedState;
    workInProgressRootFiber.nodeType = currentRootFiber.nodeType;
    //! 合并两个节点
    workInProgressRootFiber.alternate = currentRootFiber;
    currentRootFiber.alternate = workInProgressRootFiber;
    return workInProgressRootFiber;
}
//! -----------------模拟Commit阶段-----------------------------
//! 分为三部分  beforeMutation  mutation  layout阶段
//! before 前置处理  mutation 渲染dom节点   layout  处理useEffect useLayoutEffect
function commitPart(finishedWorkFiber) {
    beforeMutation(finishedWorkFiber); // beforeMutation阶段
    commitFiberNodeMutation(GlobalFiber_1.global.EffectList); //  mutation阶段 
    //todo  layout阶段  调用Effects链表 执行create函数()
    //todo 处理ref
}
function updateCommitPart(finishedWorkFiber) {
    beforeMutation(finishedWorkFiber); // beforeMutation阶段
    commitFiberNodeMutation(GlobalFiber_1.global.EffectList); // mutation阶段 
    //todo  layout阶段  调用Effects链表 执行create函数()
    //todo 处理ref
}
//! beforeMutation阶段 (将收集好的useEffect生成一个Effect 推入链表)
function beforeMutation(finishedWorkFiber) {
    (0, Reconciler_1.reconcileUseEffect)(finishedWorkFiber, null);
}
//! mutation阶段  遍历EffectList  对每个节点执行更新(分为添加  删除  更新 三大部分 )
//todo 遍历EffectList单链表 预留优先级调用 更新fiber
function commitFiberNodeMutation(EffectList, lane) {
    console.log('本次更新的EffectList', EffectList);
    let currentEffect = EffectList.firstEffect;
    // TODO 在这里将effect循环用requestAnimationFrame抱起来执行中断
    while (currentEffect !== null) {
        let effectTag = currentEffect.tag;
        let targetFiber = currentEffect.targetFiber;
        //! 经过相应处理 最后执行commitWork方法
        switch (effectTag) {
            case 'Placement': //todo  添加
                commitPlacement(targetFiber);
                break;
            case 'Delete': //todo  删除
                commitDeletion(targetFiber);
                break;
            case 'Update': //todo  更新
                commitUpdate(targetFiber);
                break;
            case 'UseEffect': //todo 调用了useEffect钩子
                commitUpdate(targetFiber);
            default:
                // commitUpdate(targetFiber) //todo 处理更新链表(effect链表和其他的effect应该是在一起的)
                break;
        }
        currentEffect = currentEffect.next;
    }
}
//todo 待完成 插入dom节点
function commitPlacement(finishedWorkFiber) {
    (0, createFiberTree_1.createDomElement)(finishedWorkFiber);
}
// todo 不同类型的fiberNode执行不同的更新 (在这里处理useEffect链表)
function commitUpdate(finishedWorkFiber) {
    const fiberType = finishedWorkFiber.nodeType;
    switch (fiberType) {
        //todo 函数组件 处理effects链表  
        case 'FunctionComponent':
            //遍历effect更新链表  执行每个上一次的destory和本次create,并挂载destory
            //在之前finishedWork阶段已经将所有effects收集 挂载到finishedWorkFiber上
            callDestoryAndUnmountDestoryList(finishedWorkFiber);
            callCreateAndMountDestoryList(finishedWorkFiber);
            break;
        //todo App根组件 处理effects链表  
        case 'AppNode':
            callDestoryAndUnmountDestoryList(finishedWorkFiber);
            callCreateAndMountDestoryList(finishedWorkFiber);
            break;
        //todo dom节点  执行dom更新操作
        case 'HostComponent':
            commitUpdateDom(finishedWorkFiber);
            break;
        //todo text节点 单独更新
        case 'HostText':
            commitUpdateText(finishedWorkFiber);
    }
}
// todo 删除多余的currentFiber和dom节点
function commitDeletion(currentFiber) {
    // 删除dom节点
    const dom = currentFiber.stateNode;
    if (typeof dom !== 'function') {
        dom.remove();
    }
    //从父节点处遍历删除该节点
    const parentNode = currentFiber.parentNode;
    parentNode.children.forEach((childNode, index) => {
        if (childNode === currentFiber) {
            parentNode.children.splice(index, 1);
        }
    });
}
//todo 记录  我这里直接遍历fiber树  发现有需要变更的节点直接进行变更,
//todo 而react中在render阶段遍历 发现变更 打上tag  生成update , 推入effect链表中  为了实现优先级调度
// 错误记录 : 赋值dom节点新的text后   没有handleProps   
// 因为新的click函数的获取在这里   如果不执行  每次点击执行的都是上一次的点击事件 
// 所以不更新视图
// todo dom节点的更新
function commitUpdateDom(finishedWorkFiber) {
    const domElement = finishedWorkFiber.stateNode;
    if (typeof domElement === 'function')
        return;
    diffProps(finishedWorkFiber, domElement);
}
//TODO text节点的更新
function commitUpdateText(finishedWorkFiber) {
    const domElement = finishedWorkFiber.stateNode;
    if (typeof domElement === 'function')
        return;
    // 这里更改的是dom.firstChild  会新建一个nodeValue
    //! 注意 这里需要处理props  不然点击事件不会更新  第二次点击num不会++  
    //! 点击时获取的num变量还是上一次的变量
    diffProps(finishedWorkFiber, domElement);
    // ! 比较text是否变化 变化则更改dom
    let fiberText = finishedWorkFiber.text;
    let domText = domElement.firstChild.nodeValue;
    if (domText !== fiberText) {
        console.log('更新text');
        domElement.firstChild.nodeValue = fiberText;
    }
}
//! 对标签中的属性进行diff处理 (使用前后两棵fiber树进行diff)
function diffProps(curFiber, dom) {
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
                dom.onclick = callback; // 这里不能使用addEventListener  因为需要删除上一个点击事件
                break;
            //todo  处理其他
            default:
                dom.setAttribute(key, value[0]);
                break;
        }
    }
}
//! 执行所有上一次挂载的destory  并销毁
function callDestoryAndUnmountDestoryList(finishedWorkFiber) {
    //! (此时生成了新的fiber  老fiber会被unmount) 所以destory是在组件unmount时执行的
    var updateQueue = finishedWorkFiber.updateQueue;
    var lastEffect = updateQueue !== null ? updateQueue.lastEffect : null;
    if (lastEffect !== null) {
        var firstEffect = lastEffect.next;
        var currentEffect = firstEffect;
        do {
            //todo 判断是否需要执行 执行destory
            callDestoryByTag(currentEffect);
            currentEffect = currentEffect.next;
        } while (currentEffect !== firstEffect);
    }
}
//! 执行所有的create 挂载destory
function callCreateAndMountDestoryList(finishedWorkFiber) {
    const updateQueue = finishedWorkFiber.updateQueue;
    var lastEffect = updateQueue !== null ? updateQueue.lastEffect : null;
    //todo do while遍历effect环链表 执行destory
    if (lastEffect !== null) {
        var firstEffect = lastEffect.next;
        var currentEffect = firstEffect;
        do {
            //todo 判断是否需要执行 执行create
            callCreateByTag(currentEffect);
            currentEffect = currentEffect.next;
        } while (currentEffect !== firstEffect);
    }
}
//! 判断tag  执行create函数
function callCreateByTag(effect) {
    //判断effectTag决定是否执行Effect(mount和dep变更时执行)
    //React底层通过二进制来打tag
    const isFiberMount = Boolean(GlobalFiber_1.global.renderTag === 'mount');
    const isDepChange = Boolean(effect.tag === 'depChanged');
    const isNullDeps = Boolean(effect.tag === 'nullDeps');
    const isNoDeps = Boolean(effect.tag === 'noDeps');
    let needCallCreate = false;
    //根据不同情况 决定是否执行create 
    if ((isFiberMount || isDepChange || isNullDeps) || (isFiberMount && isNoDeps)) {
        needCallCreate = true;
    }
    //判断tag如果需要执行  执行create 挂载destory
    if (needCallCreate) {
        const create = effect.create;
        effect.destory = create();
    }
}
//! 判断tag  执行destory函数(需要修改)
function callDestoryByTag(effect) {
    //判断effectTag决定是否执行Effect(mount和dep变更时执行)
    //React底层通过二进制来打tag
    const isFiberMount = Boolean(GlobalFiber_1.global.renderTag === 'mount');
    const isDepChange = Boolean(effect.tag === 'depChanged');
    const isNullDeps = Boolean(effect.tag === 'nullDeps');
    const isNoDeps = Boolean(effect.tag === 'noDeps');
    let needCallDestory = false;
    //根据不同情况 决定是否执行create 
    if ((isFiberMount || isDepChange || isNullDeps) || (isFiberMount && isNoDeps)) {
        needCallDestory = true;
    }
    //判断tag如果需要执行  执行并销毁effect上的destory
    var destory = effect.destory;
    if (destory !== undefined && needCallDestory) {
        destory();
        effect.destory = undefined;
    }
}
//! ----------遍历fiber  收集effect 挂载到本次root节点 识别删除节点------------------
function finishedWork(workInProgressFiber, currentFiber) {
    // 遍历fiber树 将所有Effect添加进root节点的update环链表中
    //TODO  这里相当于重置了updateQueue
    const root = workInProgressFiber;
    let rootUpdateQueue = { lastEffect: null };
    // 首屏不需要diff  更新需要进行diff计算
    GlobalFiber_1.global.renderTag === 'mount'
        ? finishedWorkLoop(workInProgressFiber, rootUpdateQueue)
        : updateFinishedWorkLoop(workInProgressFiber, currentFiber, rootUpdateQueue);
    // 处理好的updateQueue成为到本次root节点的updateQueue
    root.updateQueue = rootUpdateQueue;
    return root;
}
//! 遍历fiber  拼接所有的effect   
function finishedWorkLoop(workInProgressFiber, rootUpdateQueue) {
    // 拼接两个链表
    collectEffect(workInProgressFiber, rootUpdateQueue);
    // 继续遍历fiber树  拼接链表
    const wkChildren = workInProgressFiber.children;
    for (let i = 0; i < wkChildren.length; i++) {
        finishedWorkLoop(wkChildren[i], rootUpdateQueue);
    }
}
//! 更新时的finishedWork
function updateFinishedWorkLoop(workInProgressFiber, currentFiber, rootUpdateQueue) {
    // 拼接两个链表
    collectEffect(workInProgressFiber, rootUpdateQueue);
    //TODO ---------diff两个节点 打上tag 生成Effect交给commit阶段更新------------
    (0, Reconciler_1.reconcileFiberNode)(workInProgressFiber, currentFiber);
    // 遍历fiber树 (最长遍历) (需要注意fiber为null的情况)
    let length;
    let wkChildren = [];
    let curChildren = [];
    if (workInProgressFiber && currentFiber) {
        wkChildren = workInProgressFiber.children;
        curChildren = currentFiber.children;
        length = wkChildren.length > curChildren.length
            ? wkChildren.length : curChildren.length;
    }
    else if (!workInProgressFiber) {
        curChildren = currentFiber.children;
        length = currentFiber.children.length;
    }
    else if (!currentFiber) {
        wkChildren = workInProgressFiber.children;
        length = workInProgressFiber.children.length;
    }
    // 继续遍历fiber树  拼接链表
    for (let i = 0; i < length; i++) {
        updateFinishedWorkLoop(wkChildren[i], curChildren[i], rootUpdateQueue);
    }
}
//! 收集所有的Effect(hook)
function collectEffect(fiber, rootUpdateQueue) {
    if (!fiber)
        return;
    const fiberUpdateQueue = fiber.updateQueue;
    if (fiberUpdateQueue && fiberUpdateQueue.lastEffect) {
        rootUpdateQueue.lastEffect = fiberUpdateQueue.lastEffect;
        fiberUpdateQueue.lastEffect.next = rootUpdateQueue.lastEffect.next;
    }
}
//!--------------综合Render方法-------------------
function render(functionComponent, rootDom) {
    console.log('------------render-------------');
    //todo 初始化workInProgress树
    const workInProgressFiber = new GlobalFiber_1.NewFiberNode('mount', '$1');
    GlobalFiber_1.global.workInprogressFiberNode = workInProgressFiber; //挂载到全局
    //todo render阶段
    const beginWorkFiber = renderPart(functionComponent, rootDom, workInProgressFiber);
    // 从下往上遍历fiber收集所有的Effects 形成环链表 上传递优先级给root
    //! 这里finishedWork应该在renderPart中   待修改
    const finishedWorkFiber = finishedWork(beginWorkFiber, null);
    //todo commit阶段
    commitPart(finishedWorkFiber);
}
exports.render = render;
function updateRender(functionComponent, workInProgressFiber, currentFiber) {
    console.log('------------updateRender-------------');
    resetFiber(currentFiber); //更新render时需要先将fiber的数据重置  重新挂载数据
    if (workInProgressFiber) {
        resetFiber(workInProgressFiber); //更新render时需要先将fiber的数据重置  重新挂载数据
    }
    // 更新fiber树
    const beginWorkFiber = updateRenderPart(functionComponent, workInProgressFiber, currentFiber);
    // 从下往上遍历fiber收集所有的Effects 形成环链表 上传递优先级给root
    const finishedWorkFiber = finishedWork(beginWorkFiber, currentFiber);
    updateCommitPart(finishedWorkFiber);
}
exports.updateRender = updateRender;
//todo ----遍历清空fiber树上的hookIndex 和 queue 和 EffectTag
function resetFiber(fiber) {
    fiber.hookIndex = 0;
    fiber.updateQueue = null;
    GlobalFiber_1.global.EffectList = { firstEffect: null, lastEffect: null, length: 0 };
    GlobalFiber_1.global.destoryEffectsArr = [];
    if (fiber.children.length !== 0) {
        fiber.children.forEach((fiber) => {
            resetFiber(fiber);
        });
    }
}
exports.resetFiber = resetFiber;
//! --------------废弃部分   handleProps 和 createElement放在了createFiber文件中----------------
// {
//     //! (从更新的rootDom处开始)根据fiberTree创建html
//     function updateHtml(fiber: any, rootDom: HTMLBodyElement) {
//         //todo 深度优先递归children 从dom下一层渲染子dom节点
//         fiber.children.forEach((fiber: any) => {
//             createHtml(fiber, rootDom)
//         });
//     }
//     function createHtml(fiber: any, rootDom: HTMLBodyElement) {
//         //不同的tag标签创建不同的html标签
//         let dom = document.createElement(fiber.tag)
//         //todo 如果是组件节点   挂载ref
//         if (fiber.tag[0] === fiber.tag[0].toUpperCase()) {
//             dom = document.createElement('fc-' + fiber.tag)
//             fiber.ref = dom
//             //todo 如果是小写 判断为html标签 填充文本 处理属性
//         }
//         else {
//             handleProps(fiber, dom)
//             if (fiber.text) { dom.innerHTML = fiber.text }
//         }
//         //todo 深度优先递归children 从dom开始渲染子dom节点
//         fiber.children.forEach((fiber: any) => {
//             createHtml(fiber, dom)
//         });
//         rootDom.appendChild(dom)
//     }
//     //! 遍历树获取所有的Effect(执行create和生成destory函数数组)
//     function handleEffect(fiber: FiberNode) {
//         let destoryEffectsArr: Effect[] = []
//         if (fiber.updateQueue) {
//             const createEffectsArr = createCallbackQueue(fiber)
//             destoryEffectsArr = doCreateQueue(createEffectsArr)
//         }
//         if (fiber.children.length !== 0) {
//             fiber.children.forEach((fiber) => {
//                 handleEffect(fiber)
//             })
//         }
//         global.destoryEffectsArr.push(...destoryEffectsArr)
//     }
//     //todo 遍历Effect链表 将需要执行的Effect推入数组--------------
//     function createCallbackQueue(fiber: FiberNode) {
//         const createEffectsArr: Effect[] = []
//         const lastEffect = fiber.updateQueue.lastEffect
//         const firstEffect = lastEffect.next
//         let currentEffect = firstEffect
//         do {
//             //判断effectTag决定是否执行Effect(mount和dep变更时执行)
//             //React底层通过二进制来打tag
//             const isFiberMount = Boolean(global.renderTag === 'mount')
//             const isDepChange = Boolean(currentEffect.tag === 'depChanged')
//             const isNullDeps = Boolean(currentEffect.tag === 'nullDeps')
//             const isNoDeps = Boolean(currentEffect.tag === 'noDeps')
//             //根据不同情况 将Effect推入数组  达到不同的useEffect的效果
//             if (isFiberMount || isDepChange || isNullDeps) {
//                 createEffectsArr.push(currentEffect)
//             } else if (isFiberMount && isNoDeps) {
//                 createEffectsArr.push(currentEffect)
//             }
//             currentEffect = currentEffect.next
//         } while (currentEffect !== firstEffect)
//         return createEffectsArr
//     }
//     //todo 遍历执行需要执行的Effect---生成destory---------
//     function doCreateQueue(createEffectsArr: Effect[]) {
//         const destoryEffectsArr: Effect[] = []
//         //todo 遍历Effects数组 执行create
//         //todo 生成destoryEffect数组 将destory存放到对应的Effect上
//         for (let i = 0; i < createEffectsArr.length; i++) {
//             const destory = createEffectsArr[i].create() // 执行create
//             if (destory) {
//                 createEffectsArr[i].destory = destory // 赋值destory
//                 destoryEffectsArr.push(createEffectsArr[i])   //推入destory数组
//             }
//         }
//         return destoryEffectsArr
//     }
// }
// this.jql += ` AND description ~ ${keyword[0]}`; // 描述查询
// this.jql += ` OR issuekey = ${keyword[0]}`; // ID查询
