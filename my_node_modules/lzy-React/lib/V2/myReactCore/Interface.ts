import type { FiberNode } from './GlobalFiber'

//全局变量声明
declare global {
    interface Window {
        $$routeContainerFiber?: any
        $$lzyReactGlobal?: Global
    }
}


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


//!-------------全局需要的变量结构---------------
interface Global {
    workInprogressFiberNode: FiberNode | null,
    workInProgressHook: { currentHook: any },
    EffectList: { firstEffect: any, lastEffect: any, length: number },
    destoryEffectsArr: Effect[],
    renderTag: string
}

//! -------------element结构----------------
type ElementNode = {
    $$typeof: symbol
    key: string
    props: Record<any, any>
    ref: any //TODO 预备ref类型
    tag: string
    fiber: FiberNode
    _child: ElementNode | TextElementNode
    _sibling: ElementNode | TextElementNode
    _parent: ElementNode | TextElementNode
    text?: string
}

type TextElementNode = {
    $$typeof: symbol
    tag: 'text'
    text: string
    fiber: FiberNode
    _child: ElementNode | TextElementNode
    _sibling: ElementNode | TextElementNode
    _parent: ElementNode | TextElementNode
    props?: any
    ref?: any
    key?: string
}

export type { FiberNode, StateUpdater, Effect, UseStateHook, UseEffectHook, Global, ElementNode, TextElementNode }