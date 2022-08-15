import type { FiberNode, Global } from './Interface'

//! ----------Fiber节点结构---------------
class NewFiberNode implements FiberNode {
    memorizedState: any
    stateNode: Function | HTMLElement | null
    updateQueue: any
    stateQueueTimer: any
    fiberFlags: 'mount' | 'update' | undefined
    // effectTag: 'Update' | 'Delete' | 'Placement' | undefined
    hasRef: boolean
    ref: any
    children: any
    props: any
    tag: any
    text: any
    sourcePool: any
    hookIndex: number
    parentNode: FiberNode | null
    nodeType: 'HostText' | 'HostComponent' | 'FunctionComponent' | 'AppNode' | undefined
    alternate: FiberNode | null
    $fiber: '$1' | '$2' | undefined
    key: number | null
    constructor(fiberFlags, $fiber) {
        this.memorizedState = null,// fiber上的所有hook链表
            this.stateNode = null,    // 对应的函数组件 或者Dom节点
            this.updateQueue = null, // Effects的更新链表
            this.stateQueueTimer = null, // 用于state的合并更新(setTimeout)
            this.fiberFlags = fiberFlags,// fiber的生命周期 判断是否初始化
            // this.effectTag = undefined, //  用于标记需要执行的Effect 执行对应操作
            this.hasRef = false,//ref相关tag
            this.ref = null,
            this.children = [],
            this.props = null,
            this.tag = null,   // 节点的tag 比如div/Demo
            this.text = null,
            this.sourcePool = null, ///! 组件返回的资源  props和事件
            this.hookIndex = 0, // 用于记录hook的数量 以便查找
            this.parentNode = null,
            this.nodeType = undefined,
            this.alternate = null,  // 对面fiber树对应的节点
            this.$fiber = $fiber, // 用于识别fiber是哪颗树
            this.key = null // 用于进行列表的diff
    }
}

//! -----需要使用的全局变量---------------
const global: Global = {
    workInprogressFiberNode: null, //! 当前工作的fiber节点
    workInProgressHook: { currentHook: null },//React中使用链表来保存hooks 挂在全局
    EffectList: { firstEffect: null, lastEffect: null, length: 0 },
    destoryEffectsArr: [],
    renderTag: 'mount', // 用于判断是否是首次更新
}

//! ----------拿取需要本次update需要更新的hook----------------------
function updateWorkInProgressHook(fiber: FiberNode) {

    let index = fiber.hookIndex
    let currentHook = fiber.memorizedState

    while (currentHook && currentHook.index != index) {
        currentHook = currentHook.next
    }
    // 因为链表是按顺序的 所以这个函数每执行一次就新增一个
    fiber.hookIndex += 1
    return currentHook
}

export { global, updateWorkInProgressHook, NewFiberNode }
