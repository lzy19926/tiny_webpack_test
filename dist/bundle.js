(function () {
    var modules = {
        "E:\\My_Webpack\\myWebpack\\src\\index.js": [function (s, e, c) { "use strict"; var o = s("./js/info.js"); console.log(o.b) }, { "./js/info.js": "E:\\My_Webpack\\myWebpack\\src\\js\\info.js", "./css/test1.css": "E:\\My_Webpack\\myWebpack\\src\\css\\test1.css", "./css/test2.css": "E:\\My_Webpack\\myWebpack\\src\\css\\test2.css" }],
        "E:\\My_Webpack\\myWebpack\\src\\js\\info.js": [function (s, e, c) { "use strict"; var o = s("./constants.js").a; console.log("a", o), e.exports = { b: 2 } }, { "./constants.js": "E:\\My_Webpack\\myWebpack\\src\\js\\constants.js" }],
        "E:\\My_Webpack\\myWebpack\\src\\js\\constants.js": [function (s, e, c) { "use strict"; var o = 1; o += 1, e.exports = { a: o, c: 3 } }, {}]
    }; function require(s) {
        const [e, c] = modules[s], o = { exports: {} };
        //! 构造fn所需的require函数(loaclRequire 通过相对路径获取绝对路径(id)并执行require)
        //! 将本模块导出的代码返回
        //! 将三个参数传入fn并执行
        return e((s => require(c[s])), o, o.exports), o.exports
    }
    //! 执行require(entry)入口模块
    function hotModuleReplace() { var ws = new WebSocket("ws://localhost:3001/"); ws.onopen = function (s) { console.warn("websocket连接成功,热更新准备就绪") }, ws.onmessage = function (res) { const newModule = eval("(" + res.data + ")"); for (let s in newModule) modules[s] = newModule[s], require("E:\\My_Webpack\\myWebpack\\src\\index.js") } } require("E:\\My_Webpack\\myWebpack\\src\\index.js"), hotModuleReplace()
})();