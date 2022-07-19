
    // -------------------泽亚的webpack---------------------------
        (function(){
            //todo 传入modules
            var modules = {"E:\\My_Webpack\\myWebpack\\src\\index.js":[
 function(require,module,exports){
            "use strict";

var _info = require("./info.js");

console.log(_info.info);
        } ,
 {"./info.js":"E:\\My_Webpack\\myWebpack\\src\\info.js"} 
 ],
"E:\\My_Webpack\\myWebpack\\src\\info.js":[
 function(require,module,exports){
            "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.info = void 0;

var _constants = require("./constants.js");

var info = "\u59D3\u540D:".concat(_constants.name, ",\u6027\u522B:").concat(_constants.sex, ",\u5E74\u9F84:").concat(_constants.age);
exports.info = info;
        } ,
 {"./constants.js":"E:\\My_Webpack\\myWebpack\\src\\constants.js"} 
 ],
"E:\\My_Webpack\\myWebpack\\src\\constants.js":[
 function(require,module,exports){
            "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sex = exports.name = exports.age = void 0;
var name = '王五';
exports.name = name;
var age = 18;
exports.age = age;
var sex = '男';
exports.sex = sex;
        } ,
 {} 
 ],
}

            //todo 创建require函数 获取modules的函数代码和mapping对象
            function require(raletivePath){

                //! 通过id获取module 解构出代码执行函数fn和mapping
                const [fn,mapping]  = modules[raletivePath]

                //! 构造fn所需的三个参数 构建自己的module对象
                //todo loaclRequire 通过相对路径获取绝对路径(id)并执行require
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
             require("E:\\My_Webpack\\myWebpack\\src\\index.js")
            //! 开启热模块替换(是否添加代码)
            
    //todo 热模块替换代码  监听src下文件夹变化  重新生成bundle中的代码并传给客户端  使用eval执行代码
    function hotModuleReplace() {
        var ws = new WebSocket("ws://localhost:3001/");
        //监听建立连接
        ws.onopen = function (res) {
            console.warn('websocket连接成功,热更新准备就绪');
        }

        //监听服务端发来modules 
        ws.onmessage = function (res) {
            const newModule = eval('(' + res.data + ')')
            for (let key in newModule) { //替换本地的modules 重新执行require(entry) (重新执行bundle整体文件)
                modules[key] = newModule[key]
                require("E:\\My_Webpack\\myWebpack\\src\\index.js")
            }
        }
    };

    hotModuleReplace()

        })();
    