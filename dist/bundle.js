
    // -------------------泽亚的webpack---------------------------
        (function(){
            //todo 传入modules
            var modules = {0:[
 function(require,module,exports){
            "use strict";

var _constants = require("./constants.js");

console.log("\u6211\u53EB".concat(_constants.name, ",\u4ECA\u5E74").concat(_constants.age, "\u5C81,\u6027\u522B").concat(_constants.sex), b);
        } ,
 {"./constants.js":1} 
 ],
1:[
 function(require,module,exports){
            "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sex = exports.role = exports.name = exports.age = void 0;
var name = '王五9';
exports.name = name;
var age = 12345;
exports.age = age;
var sex = '男';
exports.sex = sex;
var role = '学生123';
exports.role = role;
        } ,
 {} 
 ],
}

            //todo 创建require函数 获取modules的函数代码和mapping对象
            function require(id){

                //! 通过id获取module 解构出代码执行函数fn和mapping
                const [fn,mapping]  = modules[id]

                //! 构造fn所需的三个参数 构建自己的module对象
                //todo loaclRequire 通过相对路径获取id并执行require
                const loaclRequire =(relativePath)=>{
                    return  require(mapping[relativePath])
                }

                //! 构造模拟Node的module对象
                const module = {
                    exports:{}
                }

                //! 将三个参数传入fn并执行
                fn(loaclRequire,module,module.exports)

                //! 将本模块导出的代码返回
                //todo 因为上面fn中传入了module.export,转换后的ES5代码会识别export关键字  
                //todo 并将需要导出的变量添加进module.exports对象中
                return module.exports
            }

            //! 执行require(entry)入口模块
             require(0)

        })();
    
    //todo 热模块替换代码  监听src下文件夹变化  重新生成bundle中的代码并传给客户端  使用eval执行代码
    (function hotModuleReplace() {
        var ws = new WebSocket("ws://localhost:3001/");
        //监听建立连接
        ws.onopen = function (res) {
            console.warn('websocket连接成功,热更新准备就绪');
        }
    
        //监听服务端发来的消息
        ws.onmessage = function (res) {
            eval(res.data)
        }
    })();
    