
// -------------------泽亚的webpack---------------------------
(function () {
    //todo 传入modules
    var modules = {
        "E:\\My_Webpack\\myWebpack\\src\\index.js": [
            function (require, module, exports) {
                "use strict";

                var _info = require("./js/info.js");

                console.log(_info.b);
            },
            { "./js/info.js": "E:\\My_Webpack\\myWebpack\\src\\js\\info.js", "./css/test1.css": "E:\\My_Webpack\\myWebpack\\src\\css\\test1.css", "./css/test2.css": "E:\\My_Webpack\\myWebpack\\src\\css\\test2.css" }
        ],
        "E:\\My_Webpack\\myWebpack\\src\\js\\info.js": [
            function (require, module, exports) {
                "use strict";

                // import { name, age, sex } from './constants.js'
                var _require = require('./constants.js'),
                    a = _require.a;

                console.log(a);
                module.exports = {
                    b: 2
                }; // export const info = `姓名:${name},性别:${sex},年龄:${age}`
            },
            { "./constants.js": "E:\\My_Webpack\\myWebpack\\src\\js\\constants.js" }
        ],
        "E:\\My_Webpack\\myWebpack\\src\\js\\constants.js": [
            function (require, module, exports) {
                "use strict";

                // function _readOnlyError(name) { throw new TypeError("\"" + name + "\" is read-only"); }

                var a = 1;
                a = a + 1
                // a + 1, _readOnlyError("a");
                module.exports = {
                    a: a
                };
            },
            {}
        ],
    }

    //todo 创建require函数 获取modules的函数代码和mapping对象
    function require(raletivePath) {

        const [fn, mapping] = modules[raletivePath]

        //! 构造fn所需的require函数(loaclRequire 通过相对路径获取绝对路径(id)并执行require)
        const loaclRequire = (relativePath) => {
            return require(mapping[relativePath])
        }

        //! 构造模拟Node的module对象
        const module = {
            exports: {}
        }

        //! 将三个参数传入fn并执行
        fn(loaclRequire, module, module.exports)

        //! 将本模块导出的代码返回
        //todo 因为上面fn中传入了module.export,转换后的ES5代码会识别export关键字  
        //todo 并将需要导出的变量添加进module.exports对象中
        return module.exports
    }

    //! 执行require(entry)入口模块
    require("E:\\My_Webpack\\myWebpack\\src\\index.js")


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