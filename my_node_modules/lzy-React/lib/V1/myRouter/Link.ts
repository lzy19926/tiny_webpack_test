import { render } from '../../index_V2'
import { myUseEffect } from '../../index_V2'

declare global {
    interface Window {
        $$routeContainerFiber?: any
    }
}


function Link({ to, title, component }) {

    //! 使用myUseEffect实现路由重定向
    myUseEffect(() => {
        if (to === '/') {
            switchRouteHistory()
        }
    })


    function handleRouteChange() {
        if (location.hash === to.slice(1)) return
        switchRouteHistory()
    }

    //todo history模式路由页面简易逻辑
    function switchRouteHistory() {
        //todo 修改页面path
        history.pushState(null, null, to)
        //todo 获取容器DOM(刚开始获取不到)
        const container = document.getElementById('routeContainer')
        //todo 创建到容器节点时  将容器节点的fiber挂载到全局  以便获取(需修改)
        const containerFiber = window.$$routeContainerFiber.children[0]

        //todo 改变fiebrFlag，以便创建新的组件节点(需要修改)
        containerFiber.fiberFlags = 'mount'

        //todo 重新render该组件
        //todo 重置当前fiber(初始化所有状态)
        containerFiber.children = []
        containerFiber.memorizedState = null
        containerFiber.hookIndex = 0

        render(component, container, containerFiber)
    }

    //todo 测试 hash模式路由
    function switchRouteHash() {
        location.hash = to
        //todo 获取容器DOM(刚开始获取不到)
        const container = document.getElementById('routeContainer')
        //todo 创建到容器节点时  将容器节点的fiber挂载到全局  以便获取(需修改)
        const containerFiber = window.$$routeContainerFiber
        //todo 改变fiebrFlag，以便创建新的组件节点(需要修改)
        containerFiber.fiberFlags = 'mount'

        //todo 重置当前fiber(初始化所有状态)
        containerFiber.children = []
        containerFiber.memorizedState = null
        //todo 重新render该组件
        render(component, container, containerFiber)
    }

    return {
        data: { handleRouteChange },
        template: `<a href='${to}' onClick={handleRouteChange}>${title}</a>`
    }
}


export default Link