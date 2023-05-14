// 使用zuiUI
import LzyReact, { myUseEffect } from 'lzy-react'

// 错误调用hook
myUseEffect(() => { })

export function App () {
  return (<div>1111</div>)
}

class App2 {
  constructor () {
    myUseEffect(() => { }) //! 错误调用hook
  }

  render () {
    return (<div>1111</div>)
  }
}

console.log(App2)
