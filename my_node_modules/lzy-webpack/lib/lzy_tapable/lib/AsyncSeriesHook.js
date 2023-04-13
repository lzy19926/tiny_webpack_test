
// AsyncSeriesHook 用于异步执行钩子函数
// 需要在回调函数中手动调用 callback() 来告知 Tapable 是否继续执行下一个回调函数(promise嵌套)

/*
传入的是回调接收的参数,这里传入compiler,下面的回调就会接收内部的compiler作为参数
const hook = new AsyncSeriesHook(['compiler']) 

hook.tapAsync('MyPlugin1', (compiler, callback) => {
    setTimeout(() => {
        console.log('执行一些异步操作');
        callback(); // 告知 Tapable 继续执行下一个回调函数 (执行MyPlugin2)
    }, 1000);
});

hook.tapAsync('MyPlugin2', (compiler, callback) => {
    setTimeout(() => { console.log('执行一些异步操作'); callback() }, 1000);
}); 

! 最终执行callAsync,传入最后一个回调函数
hooks.callAsync('myCompiler', () => { 
  console.log('所有回调执行完毕');
});
*/


const Hook = require("./Hook");
const HookCodeFactory = require("./HookCodeFactory");

//HookCodeFactory用于二次包装hook内的回调函数,使其能够成为sync async promise调用
//实现HookCodeFactory中的content抽象方法, 用于构造不同种类回调的函数体(指定为Series类型)
class AsyncSeriesHookCodeFactory extends HookCodeFactory {
    content() { return this.callTapsSeries() }
}

const factory = new AsyncSeriesHookCodeFactory();

//最终使用继承并实现抽象方法Compile  改造Hook 生成AsyncSeriesHook
// 单独实现抽象方法compile
class AsyncSeriesHook extends Hook {
    compile(options) {
        factory.setup(this, options);
        return factory.create(options);
    }
}


module.exports = AsyncSeriesHook;