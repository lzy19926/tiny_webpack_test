
### 仿写的tapable库



### 用法:以SyncHook举例
~~~JS
// 新建一个hook,传入compiler作为参数
const hook = new SyncHook(['compiler'])
// hook中添加一个回调 名称为001
    hook.tap('001', (compiler, callback) => {
        console.log('----1');
    });
// hook中添加一个回调 名称为001
    hook.tap('002', (compiler, callback) => {
        console.log('----2');
    });
// 执行hooks, 依次顺序执行所有回调
    hook.call();
~~~


### 提供hook类型
1. SyncHook 同步回调 依次顺序执行
2. AsyncSeriesHook 支持异步回调  需要手动执行callback来触发下一个回调
3. SyncWaterfallHook 同步回调    下一个函数获得上一个函数的返回值