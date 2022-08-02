
    // -------------------泽亚的webpack---------------------------
        (function(){
            //todo 传入modules
            var modules = {"E:\\My_Webpack\\myWebpack\\src\\index.js":[
 function(require,module,exports){
            "use strict";

var _info = require("./js/info.js");

console.log(_info.info);
        } ,
 {"./js/info.js":"E:\\My_Webpack\\myWebpack\\src\\js\\info.js","./css/test1.css":"E:\\My_Webpack\\myWebpack\\src\\css\\test1.css","./css/test2.css":"E:\\My_Webpack\\myWebpack\\src\\css\\test2.css"} 
 ],
"E:\\My_Webpack\\myWebpack\\src\\js\\info.js":[
 function(require,module,exports){
            "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.info = void 0;

var _constants = require("./constants.js");

var info = "\u59D3\u540D:".concat(_constants.name, ",\u6027\u522B:").concat(_constants.sex, ",\u5E74\u9F84:").concat(_constants.age); // export const info = `姓名:${name},性别:${sex}`

exports.info = info;
        } ,
 {"./constants.js":"E:\\My_Webpack\\myWebpack\\src\\js\\constants.js"} 
 ],
"E:\\My_Webpack\\myWebpack\\src\\js\\constants.js":[
 function(require,module,exports){
            "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sex = exports.name = exports.age = void 0;
var name = '张三';
exports.name = name;
var age = 33;
exports.age = age;
var sex = '男';
exports.sex = sex;
        } ,
 {} 
 ],
}

            //todo 创建require函数 获取modules的函数代码和mapping对象
            function require(raletivePath){

                const [fn,mapping]  = modules[raletivePath]

                //! 构造fn所需的require函数(loaclRequire 通过相对路径获取绝对路径(id)并执行require)
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
            
        
        //todo 热模块替换代码  监听src下文件夹变化  重新生成bundle中的代码并传给客户端  使用eval执行代码
        const hotUpdate = (newModule) => {
            for (let key in newModule) { //替换本地的modules 重新执行require(entry) (重新执行bundle整体文件)
                modules[key] = newModule[key]
                require("E:\\My_Webpack\\myWebpack\\src\\index.js")
            }
        }
    
        const hotCreate = (newModule) => {
            for (let key in newModule) {
                modules[key] = newModule[key]
                require("E:\\My_Webpack\\myWebpack\\src\\index.js")
            }
        }
    
        const hotDelete = (key) => {
            delete modules[key]
            require("E:\\My_Webpack\\myWebpack\\src\\index.js")
        }
    
        function hotModuleReplace() {
            var ws = new WebSocket("ws://localhost:3001/");
            //监听建立连接
            ws.onopen = function (res) {
                console.warn('websocket连接成功,热更新准备就绪');
            }
    
            //监听服务端发来的事件和数据 执行不同的方法
            ws.onmessage = function (res) {
                const { event, data } = eval('(' + res.data + ')')
                switch (event) {
                    case 'update': hotUpdate(data)
                        break;
                    case 'delete': hotDelete(data)
                        break;
                    case 'create': hotCreate(data)
                        break;
                }
            }
        };
    
        hotModuleReplace()
        })();