!function(){var modules={"E:\\My_Webpack\\myWebpack\\src\\index.js":[function(e,s,t){"use strict";var c=e("./constants.js");e("./test2/test2.js");console.log("我叫".concat(c.name,",今年").concat(c.age,"岁,性别").concat(c.sex))},{"./constants.js":"E:\\My_Webpack\\myWebpack\\src\\constants.js","./test2/test2.js":"E:\\My_Webpack\\myWebpack\\src\\test2\\test2.js"}],"E:\\My_Webpack\\myWebpack\\src\\constants.js":[function(e,s,t){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.sex=t.role=t.name=t.age=void 0;t.name="王五9",t.age=15,t.sex="男";t.role="学生123"},{}],"E:\\My_Webpack\\myWebpack\\src\\test2\\test2.js":[function(e,s,t){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.num=void 0;t.num=3},{}]};function require(e){const[s,t]=modules[e];e={exports:{}};return s(e=>require(t[e]),e,e.exports),e.exports}function hotModuleReplace(){var ws=new WebSocket("ws://localhost:3001/");ws.onopen=function(e){console.warn("websocket连接成功,热更新准备就绪")},ws.onmessage=function(res){const newModule=eval("("+res.data+")");for(var key in newModule)modules[key]=newModule[key],require("E:\\My_Webpack\\myWebpack\\src\\index.js")}}require("E:\\My_Webpack\\myWebpack\\src\\index.js"),hotModuleReplace()}();