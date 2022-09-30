//!--------------单个UseEffectHook结构-------------------
//todo 通过判断tag 'useEffect','useLayoutEffect' 来判断何种钩子  改变执行时机
interface UseEffectHook {
    hookFlags: string,
    index: number,
    memorizedState: any,
    next: any
}

//!------------单个Effect(EffectUpdater)结构--------------------
interface Effect {
    tag: string,
    create: Function,
    destory: Function | null,
    deps: any[] | null,
    next: Effect | null,
}

//!-------------单个useStateHook结构-----------------
interface UseStateHook {
    hookFlags: string,
    index: number,
    memorizedState: any,
    updateStateQueue: { pending: any },//! hook.queue中保存了需要执行的update
    next: any
}

//!-------------单个StateUpdater结构--------------------
interface StateUpdater {
    action: Function | any,
    next: StateUpdater | null
}

//!------------fiberNode结构----------------------
interface FiberNode {
    memorizedState: any,
    stateNode: Function | HTMLElement | null,
    updateQueue: any,
    stateQueueTimer: any,
    fiberFlags: 'mount' | 'update' | undefined,
    // effectTag: 'Update' | 'Delete' | 'Placement' | undefined,
    hasRef: boolean,
    ref: any,
    children: any,
    props: any,
    tag: any,
    text: any,
    sourcePool: any,
    hookIndex: number,
    parentNode: FiberNode | null,
    nodeType: 'HostText' | 'HostComponent' | 'FunctionComponent' | 'AppNode' | undefined,
    alternate: FiberNode | null,
    $fiber: '$1' | '$2' | undefined
    key: number | null
}

//!-------------全局需要的变量结构---------------
interface Global {
    workInprogressFiberNode: FiberNode | null,
    workInProgressHook: { currentHook: any },
    EffectList: { firstEffect: any, lastEffect: any, length: number },
    destoryEffectsArr: Effect[],
    renderTag: string
}


export type { FiberNode, StateUpdater, Effect, UseStateHook, UseEffectHook, Global }