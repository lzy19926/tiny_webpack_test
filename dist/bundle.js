
        // -------------------泽亚的webpack---------------------------
            (()=>{
                //todo 传入modules
                var modules = {"E:\\My_Webpack\\myWebpack\\src\\index.js":[
 (require,module,exports)=>{
            "use strict";

var _Demo = _interopRequireDefault(require("./tinyReact/Demo.lzy"));

var _index_V = require("../my_node_modules/lzy-React/out/index_V2.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

(0, _index_V.render)(_Demo["default"], document.getElementById('root'));
        } ,
 {"./tinyReact/Demo.lzy":"E:\\My_Webpack\\myWebpack\\src\\tinyReact\\Demo.lzy","../my_node_modules/lzy-React/out/index_V2.js":"E:\\My_Webpack\\myWebpack\\my_node_modules\\lzy-React\\out\\index_V2.js"} 
 ],
"E:\\My_Webpack\\myWebpack\\src\\tinyReact\\Demo.lzy":[
 (require,module,exports)=>{
            "use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var LzyReact = _interopRequireWildcard(require("../../my_node_modules/lzy-React/out/index_V2.js"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

//! Demo组件
function Demo(props) {
  console.log(props);

  var _myUseState = (0, LzyReact.myUseState)(18),
      _myUseState2 = _slicedToArray(_myUseState, 2),
      age = _myUseState2[0],
      setAge = _myUseState2[1];

  var _myUseState3 = (0, LzyReact.myUseState)(0),
      _myUseState4 = _slicedToArray(_myUseState3, 2),
      num = _myUseState4[0],
      setNum = _myUseState4[1];

  var _myUseState5 = (0, LzyReact.myUseState)([]),
      _myUseState6 = _slicedToArray(_myUseState5, 2),
      arr = _myUseState6[0],
      setArr = _myUseState6[1];

  var longList = new Array(5000).fill(1); //! 支持useEffect全系使用(return函数 同样会发生死循环)

  (0, LzyReact.myUseEffect)(function () {
    console.log('传入[],仅仅mount时执行');
  }, []);
  (0, LzyReact.myUseEffect)(function () {
    console.log('不传 任意时候执行');
  });
  (0, LzyReact.myUseEffect)(function () {
    setNum(num + 1);
    console.log('监听age,age改变时执行');
  }, [age]); //!定义onclick方法

  function addNum() {
    setNum(num + 1); //setArr并不是异步的  而是在App执行完毕之后才会进行更新
  }

  function addAge() {
    setAge(age + 1);
  }

  function addArr() {
    setArr([].concat(_toConsumableArray(arr), ['item']));
  }

  function minArr() {
    setArr(arr.splice(1));
  }

  return /*#__PURE__*/LzyReact.createElement("div", null, /*#__PURE__*/LzyReact.createElement("h1", null, " Demo"), /*#__PURE__*/LzyReact.createElement("div", {
    "class": "alert alert-success",
    role: "alert"
  }, "\u7B80\u5355\u9002\u914D\u4E86bootStarp\u7EC4\u4EF6\u5E93"), /*#__PURE__*/LzyReact.createElement("div", {
    "class": "alert alert-info",
    role: "alert"
  }, "\u63D0\u4F9BsetState\u548CuseEffect\u94A9\u5B50\u529F\u80FD"), /*#__PURE__*/LzyReact.createElement("button", {
    type: "button",
    "class": "btn btn-primary",
    onClick: addNum
  }, "\u589E\u52A0Num"), /*#__PURE__*/LzyReact.createElement("button", {
    type: "button",
    "class": "btn btn-secondary",
    onClick: addAge
  }, "\u589E\u52A0Age\u548CNum"), /*#__PURE__*/LzyReact.createElement("h3", {
    className: "blue"
  }, "\u5F53\u524DNum:", num), /*#__PURE__*/LzyReact.createElement("h3", {
    className: "blue"
  }, "\u5F53\u524DAge:", age), /*#__PURE__*/LzyReact.createElement("div", {
    "class": "alert alert-primary",
    role: "alert"
  }, /*#__PURE__*/LzyReact.createElement("p", null, " \u63D0\u4F9Barray.map\u5217\u8868\u6E32\u67D3\u529F\u80FD"), /*#__PURE__*/LzyReact.createElement("button", {
    type: "button",
    "class": "btn btn-success",
    onClick: addArr
  }, "\u589E\u52A0Arr"), /*#__PURE__*/LzyReact.createElement("button", {
    type: "button",
    "class": "btn btn-warning",
    onClick: minArr
  }, "\u51CF\u5C11Arr")), arr);
}

var _default = Demo;
exports["default"] = _default;
        } ,
 {"../../my_node_modules/lzy-React/out/index_V2.js":"E:\\My_Webpack\\myWebpack\\my_node_modules\\lzy-React\\out\\index_V2.js"} 
 ],
"E:\\My_Webpack\\myWebpack\\my_node_modules\\lzy-React\\out\\index_V2.js":[
 (require,module,exports)=>{
            "use strict";

var __importDefault = void 0 && (void 0).__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createElement = exports.global = exports.Rekv = exports.updateRender = exports.render = exports.myUseEffect = exports.myUseState = void 0;

var useEffect_1 = require("./V2/myHook/useEffect.js");

Object.defineProperty(exports, "myUseEffect", {
  enumerable: true,
  get: function get() {
    return useEffect_1.myUseEffect;
  }
});

var useState_1 = require("./V2/myHook/useState.js");

Object.defineProperty(exports, "myUseState", {
  enumerable: true,
  get: function get() {
    return useState_1.myUseState;
  }
});

var render_1 = require("./V2/myReactCore/render.js");

Object.defineProperty(exports, "render", {
  enumerable: true,
  get: function get() {
    return render_1.render;
  }
});
Object.defineProperty(exports, "updateRender", {
  enumerable: true,
  get: function get() {
    return render_1.updateRender;
  }
});

var GlobalFiber_1 = require("./V2/myReactCore/GlobalFiber.js");

Object.defineProperty(exports, "global", {
  enumerable: true,
  get: function get() {
    return GlobalFiber_1.global;
  }
});

var index_1 = __importDefault(require("./V2/myRekV/index.js"));

exports.Rekv = index_1["default"];

var createElement_1 = require("./V2/myJSX/createElement.js");

Object.defineProperty(exports, "createElement", {
  enumerable: true,
  get: function get() {
    return createElement_1.createElement;
  }
});
        } ,
 {"./V2/myHook/useEffect.js":"E:\\My_Webpack\\myWebpack\\my_node_modules\\lzy-React\\out\\V2\\myHook\\useEffect.js","./V2/myHook/useState.js":"E:\\My_Webpack\\myWebpack\\my_node_modules\\lzy-React\\out\\V2\\myHook\\useState.js","./V2/myReactCore/render.js":"E:\\My_Webpack\\myWebpack\\my_node_modules\\lzy-React\\out\\V2\\myReactCore\\render.js","./V2/myReactCore/GlobalFiber.js":"E:\\My_Webpack\\myWebpack\\my_node_modules\\lzy-React\\out\\V2\\myReactCore\\GlobalFiber.js","./V2/myRekV/index.js":"E:\\My_Webpack\\myWebpack\\my_node_modules\\lzy-React\\out\\V2\\myRekV\\index.js","./V2/myJSX/createElement.js":"E:\\My_Webpack\\myWebpack\\my_node_modules\\lzy-React\\out\\V2\\myJSX\\createElement.js"} 
 ],
"E:\\My_Webpack\\myWebpack\\my_node_modules\\lzy-React\\out\\V2\\myHook\\useEffect.js":[
 (require,module,exports)=>{
            "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.myUseEffect = void 0; //修改全局变量的方法

var GlobalFiber_1 = require("../myReactCore/GlobalFiber.js"); //! -------mountEffect(useEffect第一次执行)-------------


function mountEffect(fiberFlags, hookFlags, create, deps) {
  //todo 创建Hook 成为fiber.memorizedState上的一项Hook (单向链表)
  var hook = mountWorkInProgressHook(); //判断是否传入deps 不同时机执行useEffect

  var nextDeps = deps === undefined ? null : deps; //! 根据deps传入不同的情况  实现useEffect的不同使用
  //此时memorizedState保存的就是最后更新的Effect数据(第一次destory为undefined)

  if (nextDeps === null) {
    hook.memorizedState = pushEffect('nullDeps', create, undefined, nextDeps);
  } else if (nextDeps.length === 0) {
    hook.memorizedState = pushEffect('noDeps', create, undefined, nextDeps);
  } else {
    hook.memorizedState = pushEffect('depNoChange', create, undefined, nextDeps);
  } //todo mount后 hookFlag变为update


  hook.hookFlags = 'update';
} //! --------创建一个Hook 形成环链表 添加到hook队列--------------


function mountWorkInProgressHook() {
  var fiber = GlobalFiber_1.global.workInprogressFiberNode; //! 测试
  //todo 新建一个hook

  var newHook = {
    index: 0,
    memorizedState: null,
    hookFlags: 'mount',
    next: null
  }; // 添加Hook进单向链表

  if (fiber.memorizedState !== null) {
    var lastHook = fiber.memorizedState;
    newHook.index = lastHook.index + 1;
    newHook.next = lastHook;
    fiber.memorizedState = newHook;
  } //接入hook到fiber上


  fiber.memorizedState = newHook; //接入hook到workProgress

  GlobalFiber_1.global.workInProgressHook.currentHook = newHook;
  return newHook;
} //! -------updateEffect(useEffect后续更新)-------------


function updateEffect(fiberFlags, hookFlags, create, deps) {
  var fiber = GlobalFiber_1.global.workInprogressFiberNode; //! 测试

  var currentHook = (0, GlobalFiber_1.updateWorkInProgressHook)(fiber); //判断是否传入deps 不同时机执行useEffect

  var nextDeps = deps === undefined ? null : deps; //!执行updateEffect 改变fiberFlages
  //! fiber.fiberFlags = fiberFlags
  //todo  如果有currentHook 获得上一次执行create返回的的销毁函数

  if (currentHook !== null) {
    var prevEffect = currentHook.memorizedState; //最后一次Effect
    //todo update时从上一次的Effect中取出销毁函数(在commit阶段执行create函数并赋值了destory)

    var destory = prevEffect.destory; //! 根据传入的dep 判断是否执行effect
    //注意 无论如何都会推入Effect  

    if (nextDeps !== null) {
      //todo 浅比较上次和本次的deps是否相等  传入不同的tag  用于减少更新
      var prveDeps = prevEffect.deps;

      if (shallowCompareDeps(nextDeps, prveDeps)) {
        pushEffect('depNoChange', create, destory, nextDeps);
        return;
      } //todo 如果deps发生改变  传入的tag为'depChanged' commit时这个Effects才会被执行
      //todo  (执行的最后一个effect要被赋值给memorizedState)
      else {
        currentHook.memorizedState = pushEffect('depChanged', create, destory, nextDeps);
      }
    } //! 如果没有传deps 表示任意时候都执行


    if (nextDeps === null) {
      pushEffect('nullDeps', create, undefined, nextDeps);
    }
  }
} //! ------浅比较前后deps是否发生变化-------------------


function shallowCompareDeps(nextDeps, prveDeps) {
  //todo console.log('前后dep对比', prveDeps, nextDeps);
  // 选取最大的lenght
  var length = nextDeps.length > prveDeps.length ? nextDeps.length : prveDeps.length;
  var res = true;

  for (var i = 0; i < length; i++) {
    if (nextDeps[i] !== prveDeps[i]) return res = false;
  }

  return res;
} //! --------pushEffect创建/增加Effects更新链表---------------


function pushEffect(tag, create, destory, deps) {
  var fiber = GlobalFiber_1.global.workInprogressFiberNode; //! 测试
  // 创建Effect 

  var effect = {
    tag: tag,
    create: create,
    destory: destory,
    deps: deps,
    next: null
  }; //todo 如果Hook上没有更新链表  创建更新链表  如果有则插入一个effect到更新环链表尾部

  var updateQueue = {
    lastEffect: null
  };

  if (fiber.updateQueue === null) {
    updateQueue.lastEffect = effect.next = effect; // 自身形成环状链表
    //更新fiber上的updateQueue环链表

    fiber.updateQueue = updateQueue;
  } else {
    var lastEffect = fiber.updateQueue.lastEffect;

    if (lastEffect === null) {
      //todo 有链表结构但是链表为空
      updateQueue.lastEffect = effect.next = effect; // 自身形成环状链表
    } else {
      // todo 插入effect到环链表尾端
      var firstEffect = lastEffect.next;
      lastEffect.next = effect;
      effect.next = firstEffect;
      updateQueue.lastEffect = effect; //更新fiber上的updateQueue环链表

      fiber.updateQueue = updateQueue;
    }
  } //todo 返回这个Effect 会被赋值给hook.memorizedState(最后一次更新的状态)


  return effect;
} //!------------useEffect主体--------------


function myUseEffect(create, deps) {
  var nextDeps = deps === undefined ? null : deps;
  var fiber = GlobalFiber_1.global.workInprogressFiberNode; //! 测试
  // 第一次useEffect执行mountEffect

  if (fiber.fiberFlags === 'mount') {
    var hookFlags = 'mount';
    mountEffect('mount', hookFlags, create, nextDeps); // 后续useEffect执行updateEffect
  } else if (fiber.fiberFlags === 'update') {
    var _hookFlags = 'update';
    updateEffect('update', _hookFlags, create, nextDeps);
  } //创建一个新的Effect项 推入全局EffectList中 

}

exports.myUseEffect = myUseEffect;
        } ,
 {"../myReactCore/GlobalFiber.js":"E:\\My_Webpack\\myWebpack\\my_node_modules\\lzy-React\\out\\V2\\myReactCore\\GlobalFiber.js"} 
 ],
"E:\\My_Webpack\\myWebpack\\my_node_modules\\lzy-React\\out\\V2\\myHook\\useState.js":[
 (require,module,exports)=>{
            "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.myUseState = void 0;

var render_1 = require("../myReactCore/render.js"); // 全局变量和当前 Fiber


var GlobalFiber_1 = require("../myReactCore/GlobalFiber.js"); //! ---------------useState返回的updater方法(updateState方法)-------------------


function dispatchAction(queue, curFiber, newVal) {
  //todo 如果newVal未发生变化不执行更新(可以用于手动强制更新)
  // const oldVal = curFiber.memorizedState.memorizedState
  // if (newVal === oldVal) return
  //todo 更新state队列(在render阶段执行)
  updateQueue(queue, newVal); //todo 这里使用防抖 所有queue更新完后再执行render  将timer设置在fiber上以适配Rekv
  //将多个同步setState的render合并为一个

  clearTimeout(curFiber.stateQueueTimer);
  curFiber.stateQueueTimer = setTimeout(function () {
    //! 从当前fiber节点  重新执行函数式组件  更新子fiber树(需要传入当前fiber进行递归) 
    if (typeof curFiber.stateNode === 'function') {
      var wkInFiber = curFiber.alternate;
      (0, render_1.updateRender)(curFiber.stateNode, wkInFiber, curFiber);
    }
  }, 0);
} //! 更新setate更新队列


function updateQueue(queue, newVal) {
  //创建updater环链表 将action挂载上去
  var updater = {
    action: newVal,
    next: null
  }; //pending上没有updater 自己形成环状链表  ; 有updater链表  插入一个updater

  if (queue.pending === null) {
    updater.next = updater;
  } else {
    updater.next = queue.pending.next;
    queue.pending.next = updater;
  } // 让此updater成为lastUpdater


  queue.pending = updater;
} //! 创建一个useStateHook并添加到链表中------------------------


function createHook(initialState) {
  var fiber = GlobalFiber_1.global.workInprogressFiberNode; //! 测试
  // 创建useState类型的hook

  var hook = {
    hookFlags: 'mount',
    index: fiber.memorizedState ? fiber.memorizedState.index + 1 : 0,
    memorizedState: initialState,
    updateStateQueue: {
      pending: null
    },
    next: null
  }; // 将hook添加到fiber上,且将hook链接到全局hooks链表上  成为last项

  if (!fiber.memorizedState) {
    GlobalFiber_1.global.workInProgressHook.currentHook = hook;
  } else {
    var lastEffect = fiber.memorizedState;
    hook.next = lastEffect;
  }

  GlobalFiber_1.global.workInProgressHook.currentHook = hook;
  fiber.memorizedState = hook;
  return hook;
} //! 更新该Hook的memorizedState-----------------------------


function updateUseStateHook(hook) {
  // 取出更新链表上的最后一个state
  var baseState = hook.memorizedState; //pending保存了链表最后一项   next就指向第一个update

  if (hook.updateStateQueue.pending) {
    var firstUpdate = hook.updateStateQueue.pending.next; // queue链表 执行update(执行update上的action(update传入的参数 num=>num+1))  

    do {
      var action = firstUpdate.action; //todo 更新baseState 分为传入函数和传入newValue两种情况

      baseState = typeof action === 'function' ? action(baseState) : action;
      firstUpdate = firstUpdate.next; // 链表后移
      // 终止遍历链表
    } while (firstUpdate !== hook.updateStateQueue.pending.next); // 清空state更新链表


    hook.updateStateQueue.pending = null;
  } // 遍历结束 将更新后的baseState存放到hook.memorizedState上


  hook.memorizedState = baseState;
  return baseState;
} //! ----------执行useState会执行state的计算过程----------------


function myUseState(initialState) {
  //todo  需要找到当前的fiber节点()
  var fiber = GlobalFiber_1.global.workInprogressFiberNode;
  console.log(GlobalFiber_1.global); //取出当前hook 如果是mount阶段就创建一个hook(初始值为initState)

  var hook;

  if (fiber.fiberFlags === 'mount') {
    hook = createHook(initialState); //创建hook 添加到hook链表
  } else {
    // 更新情况 找到对应的hook
    hook = (0, GlobalFiber_1.updateWorkInProgressHook)(fiber);
  } //todo 更新hook上保存的state


  var baseState = updateUseStateHook(hook); //todo 执行完useState 钩子状态变为update

  hook.hookFlags = 'update'; //todo 返回最新的状态 和updateAction 
  //todo bind本次useState的fiber节点 用于从当前组件开始更新

  return [baseState, dispatchAction.bind(null, hook.updateStateQueue, fiber)];
}

exports.myUseState = myUseState;
        } ,
 {"../myReactCore/render.js":"E:\\My_Webpack\\myWebpack\\my_node_modules\\lzy-React\\out\\V2\\myReactCore\\render.js","../myReactCore/GlobalFiber.js":"E:\\My_Webpack\\myWebpack\\my_node_modules\\lzy-React\\out\\V2\\myReactCore\\GlobalFiber.js"} 
 ],
"E:\\My_Webpack\\myWebpack\\my_node_modules\\lzy-React\\out\\V2\\myReactCore\\render.js":[
 (require,module,exports)=>{
            "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateRender = exports.render = void 0;

var createFiberTree_1 = require("../myJSX/createFiberTree.js");

var createElement_1 = require("../myJSX/createElement.js");

var updateFiberTree_1 = require("../myJSX/updateFiberTree.js");

var Reconciler_1 = require("./Reconciler.js");

var GlobalFiber_1 = require("./GlobalFiber.js"); //!--------------首屏Render方法-------------------


function firstRenderPart(functionComponent, rootDom) {
  var elementTree = (0, createElement_1.createBinadyElementTree)(functionComponent, undefined);
  var rootFiber = (0, createFiberTree_1.createFiberTree)(elementTree, undefined);
  (0, createFiberTree_1.createAlternate)(rootFiber);
  return rootFiber;
} //todo 获取上一次的fiberTree 执行所有打上tag的functionComponent进行state更新 再commit   


function updateRenderPart(functionComponent, workInProgressFiber, currentFiber) {
  var _a; // 改变tag


  GlobalFiber_1.global.renderTag = 'update';
  var parentElement = (_a = currentFiber === null || currentFiber === void 0 ? void 0 : currentFiber._parent) === null || _a === void 0 ? void 0 : _a._element;
  var newElementTree = (0, createElement_1.createBinadyElementTree)(functionComponent, parentElement);
  var workInProgressRootFiber = (0, updateFiberTree_1.updateFiberTree)(newElementTree, workInProgressFiber, currentFiber, 'rootUpdateFiber');
  return workInProgressRootFiber;
} //! -----------------模拟Commit阶段-----------------------------
//! 分为三部分  beforeMutation  mutation  layout阶段
//! before 前置处理  mutation 渲染dom节点   layout  处理useEffect useLayoutEffect


function commitPart(finishedWorkFiber) {
  beforeMutation(finishedWorkFiber); // beforeMutation阶段

  commitFiberNodeMutation(GlobalFiber_1.global.EffectList); //  mutation阶段 
  //todo  layout阶段  调用Effects链表 执行create函数()
  //todo 处理ref
}

function updateCommitPart(finishedWorkFiber) {
  beforeMutation(finishedWorkFiber); // beforeMutation阶段

  commitFiberNodeMutation(GlobalFiber_1.global.EffectList); // mutation阶段 
  //todo  layout阶段  调用Effects链表 执行create函数()
  //todo 处理ref
} //! beforeMutation阶段 (将收集好的useEffect生成一个Effect 推入链表)


function beforeMutation(finishedWorkFiber) {
  (0, Reconciler_1.reconcileUseEffect)(finishedWorkFiber, null);
} //! mutation阶段  遍历EffectList  对每个节点执行更新(分为添加  删除  更新 三大部分 )
//todo 遍历EffectList单链表 预留优先级调用 更新fiber


function commitFiberNodeMutation(EffectList, lane) {
  console.log('本次更新的EffectList', EffectList);
  var currentEffect = EffectList.firstEffect; // TODO 在这里将effect循环用requestAnimationFrame抱起来执行中断

  while (currentEffect !== null) {
    var effectTag = currentEffect.tag;
    var targetFiber = currentEffect.targetFiber; //! 经过相应处理 最后执行commitWork方法

    switch (effectTag) {
      case 'Placement':
        //todo  添加
        commitPlacement(targetFiber);
        break;

      case 'Delete':
        //todo  删除
        commitDeletion(targetFiber);
        break;

      case 'Update':
        //todo  更新
        commitUpdate(targetFiber);
        break;

      case 'UseEffect':
        //todo 调用了useEffect钩子
        commitUpdate(targetFiber);

      default:
        // commitUpdate(targetFiber) //todo 处理更新链表(effect链表和其他的effect应该是在一起的)
        break;
    }

    currentEffect = currentEffect.next;
  }
} //todo 待完成 插入dom节点


function commitPlacement(finishedWorkFiber) {
  if (finishedWorkFiber.nodeType === 'HostComponent') {
    (0, createFiberTree_1.createDomElement)(finishedWorkFiber);
  }

  if (finishedWorkFiber.nodeType === 'HostText') {
    (0, createFiberTree_1.createTextElement)(finishedWorkFiber);
  }
} // todo 不同类型的fiberNode执行不同的更新 (在这里处理useEffect链表)


function commitUpdate(finishedWorkFiber) {
  var fiberType = finishedWorkFiber.nodeType;

  switch (fiberType) {
    //todo 函数组件 处理effects链表  
    case 'FunctionComponent':
      //遍历effect更新链表  执行每个上一次的destory和本次create,并挂载destory
      //在之前finishedWork阶段已经将所有effects收集 挂载到finishedWorkFiber上
      callDestoryAndUnmountDestoryList(finishedWorkFiber);
      callCreateAndMountDestoryList(finishedWorkFiber);
      break;
    //todo App根组件 处理effects链表  

    case 'AppNode':
      callDestoryAndUnmountDestoryList(finishedWorkFiber);
      callCreateAndMountDestoryList(finishedWorkFiber);
      break;
    //todo dom节点  执行dom更新操作

    case 'HostComponent':
      commitUpdateDom(finishedWorkFiber);
      break;
    //todo text节点 单独更新

    case 'HostText':
      commitUpdateText(finishedWorkFiber);
  }
} // todo 删除多余的currentFiber和dom节点


function commitDeletion(currentFiber) {
  // 删除dom节点
  var dom = currentFiber.stateNode;

  if (typeof dom !== 'function') {
    dom.remove();
  } //从父节点处删除该节点？？？？？？


  var parentNode = currentFiber._parent;
  parentNode._child = undefined;
} //todo 记录  我这里直接遍历fiber树  发现有需要变更的节点直接进行变更,
//todo 而react中在render阶段遍历 发现变更 打上tag  生成update , 推入effect链表中  为了实现优先级调度
// 错误记录 : 赋值dom节点新的text后   没有handleProps   
// 因为新的click函数的获取在这里   如果不执行  每次点击执行的都是上一次的点击事件 
// 所以不更新视图
// todo dom节点的更新


function commitUpdateDom(finishedWorkFiber) {
  var domElement = finishedWorkFiber.stateNode;
  if (typeof domElement === 'function') return;
  (0, createFiberTree_1.handleProps)(finishedWorkFiber, domElement);
} //TODO text节点的更新


function commitUpdateText(finishedWorkFiber) {
  var domElement = finishedWorkFiber.stateNode;
  if (typeof domElement === 'function') return;
  (0, createFiberTree_1.handleProps)(finishedWorkFiber, domElement); // ! 比较text是否变化 变化则更改dom

  var fiberText = finishedWorkFiber.text;
  var domText = domElement.textContent;

  if (domText !== fiberText) {
    domElement.textContent = fiberText;
  }
} //! 执行所有上一次挂载的destory  并销毁


function callDestoryAndUnmountDestoryList(finishedWorkFiber) {
  //! (此时生成了新的fiber  老fiber会被unmount) 所以destory是在组件unmount时执行的
  var updateQueue = finishedWorkFiber.updateQueue;
  var lastEffect = updateQueue !== null ? updateQueue.lastEffect : null;

  if (lastEffect !== null) {
    var firstEffect = lastEffect.next;
    var currentEffect = firstEffect;

    do {
      //todo 判断是否需要执行 执行destory
      callDestoryByTag(currentEffect);
      currentEffect = currentEffect.next;
    } while (currentEffect !== firstEffect);
  }
} //! 执行所有的create 挂载destory


function callCreateAndMountDestoryList(finishedWorkFiber) {
  var updateQueue = finishedWorkFiber.updateQueue;
  var lastEffect = updateQueue !== null ? updateQueue.lastEffect : null; //todo do while遍历effect环链表 执行destory

  if (lastEffect !== null) {
    var firstEffect = lastEffect.next;
    var currentEffect = firstEffect;

    do {
      //todo 判断是否需要执行 执行create
      callCreateByTag(currentEffect);
      currentEffect = currentEffect.next;
    } while (currentEffect !== firstEffect);
  }
} //! 判断tag  执行create函数


function callCreateByTag(effect) {
  //判断effectTag决定是否执行Effect(mount和dep变更时执行)
  //React底层通过二进制来打tag
  var isFiberMount = Boolean(GlobalFiber_1.global.renderTag === 'mount');
  var isDepChange = Boolean(effect.tag === 'depChanged');
  var isNullDeps = Boolean(effect.tag === 'nullDeps');
  var isNoDeps = Boolean(effect.tag === 'noDeps');
  var needCallCreate = false; //根据不同情况 决定是否执行create 

  if (isFiberMount || isDepChange || isNullDeps || isFiberMount && isNoDeps) {
    needCallCreate = true;
  } //判断tag如果需要执行  执行create 挂载destory


  if (needCallCreate) {
    var create = effect.create;
    effect.destory = create();
  }
} //! 判断tag  执行destory函数(需要修改)


function callDestoryByTag(effect) {
  //判断effectTag决定是否执行Effect(mount和dep变更时执行)
  //React底层通过二进制来打tag
  var isFiberMount = Boolean(GlobalFiber_1.global.renderTag === 'mount');
  var isDepChange = Boolean(effect.tag === 'depChanged');
  var isNullDeps = Boolean(effect.tag === 'nullDeps');
  var isNoDeps = Boolean(effect.tag === 'noDeps');
  var needCallDestory = false; //根据不同情况 决定是否执行create 

  if (isFiberMount || isDepChange || isNullDeps || isFiberMount && isNoDeps) {
    needCallDestory = true;
  } //判断tag如果需要执行  执行并销毁effect上的destory


  var destory = effect.destory;

  if (destory !== undefined && needCallDestory) {
    destory();
    effect.destory = undefined;
  }
} //! ----------遍历fiber  收集effect 挂载到本次root节点 识别删除节点------------------


function finishedWork(workInProgressFiber, currentFiber) {
  // 遍历fiber树 将所有Effect添加进root节点的update环链表中
  var root = workInProgressFiber;
  var rootUpdateQueue = {
    lastEffect: null
  };
  finishedWorkLoop(workInProgressFiber, rootUpdateQueue); // 处理好的updateQueue成为到本次root节点的updateQueue

  root.updateQueue = rootUpdateQueue;
  return root;
} //! 遍历fiber  拼接所有的effect   


function finishedWorkLoop(currentFiber, rootUpdateQueue) {
  // 将updateQueue拼接到fiber的queue上
  collectEffect(currentFiber, rootUpdateQueue); // 继续遍历fiber树  拼接链表 深度优先递归执行

  var childFiber = currentFiber._child;
  var siblingFiber = currentFiber._sibling;

  if (childFiber) {
    finishedWorkLoop(childFiber, rootUpdateQueue);
  }

  if (siblingFiber) {
    finishedWorkLoop(siblingFiber, rootUpdateQueue);
  }
} //! 更新时的finishedWork(第一次不进入组件的sibling节点)


function updateFinishedWork(workInProgressFiber, currentFiber) {
  // 遍历fiber树 将所有Effect添加进root节点的update环链表中
  var rootUpdateQueue = {
    lastEffect: null
  }; // 首屏不需要diff  更新需要进行diff计算

  updateFinishedWorkLoop(workInProgressFiber, currentFiber, rootUpdateQueue, 'first'); // 处理好的updateQueue成为到本次root节点的updateQueue

  workInProgressFiber.updateQueue = rootUpdateQueue;
  return workInProgressFiber;
}

function updateFinishedWorkLoop(workInProgressFiber, currentFiber, rootUpdateQueue, tag) {
  // 拼接两个链表
  collectEffect(workInProgressFiber, rootUpdateQueue); //TODO ---------diff两个节点 打上tag 生成Effect交给commit阶段更新------------

  (0, Reconciler_1.reconcileFiberNode)(workInProgressFiber, currentFiber); // 继续遍历fiber树  拼接链表

  if (workInProgressFiber._child) {
    updateFinishedWorkLoop(workInProgressFiber._child, currentFiber._child, rootUpdateQueue);
  }

  if (workInProgressFiber._sibling && tag !== 'first') {
    // 第一次不进入组件节点的sibling
    updateFinishedWorkLoop(workInProgressFiber._sibling, currentFiber._sibling, rootUpdateQueue);
  }
} //todo ----遍历清空fiber树上的hookIndex 和 queue 和 EffectTag


function resetFiber(fiber) {
  fiber.hookIndex = 0;
  fiber.updateQueue = null;
  GlobalFiber_1.global.EffectList = {
    firstEffect: null,
    lastEffect: null,
    length: 0
  };
  GlobalFiber_1.global.destoryEffectsArr = [];

  if (fiber._child) {
    resetFiber(fiber._child);
  }

  if (fiber._sibling) {
    resetFiber(fiber._sibling);
  }
} //! 将fiber的effect链表拼接到


function collectEffect(fiber, rootUpdateQueue) {
  if (!fiber) return;
  var fiberUpdateQueue = fiber.updateQueue;

  if (fiberUpdateQueue && fiberUpdateQueue.lastEffect) {
    rootUpdateQueue.lastEffect = fiberUpdateQueue.lastEffect;
    fiberUpdateQueue.lastEffect.next = rootUpdateQueue.lastEffect.next;
  }
} //! ----------------首屏渲染----------------------------


function render(functionComponent, rootDom) {
  console.log('------------first render-------------');
  var beginWorkFiber = firstRenderPart(functionComponent, rootDom); // 从下往上遍历fiber收集所有的Effects 形成链表 上传递优先级给root
  //! 这里finishedWork应该在renderPart中  这里拆分出来了

  var finishedWorkFiber = finishedWork(beginWorkFiber, null); //todo commit阶段

  commitPart(finishedWorkFiber);
  console.log('首屏渲染生成的fiber', finishedWorkFiber);
  return finishedWorkFiber;
}

exports.render = render; //! ----------------综合updateRender方法-------------------

function updateRender(functionComponent, workInProgressFiber, currentFiber) {
  console.log('------------update render-------------');
  resetFiber(currentFiber); //更新render时需要先将fiber的数据重置  重新挂载数据

  if (workInProgressFiber) {
    resetFiber(workInProgressFiber); //更新render时需要先将fiber的数据重置  重新挂载数据
  } // 更新fiber树


  var beginWorkFiber = updateRenderPart(functionComponent, workInProgressFiber, currentFiber); // 从下往上遍历fiber收集所有的Effects 形成环链表 上传递优先级给root

  var finishedWorkFiber = updateFinishedWork(beginWorkFiber, currentFiber);
  updateCommitPart(finishedWorkFiber);
  return finishedWorkFiber;
}

exports.updateRender = updateRender;
        } ,
 {"../myJSX/createFiberTree.js":"E:\\My_Webpack\\myWebpack\\my_node_modules\\lzy-React\\out\\V2\\myJSX\\createFiberTree.js","../myJSX/createElement.js":"E:\\My_Webpack\\myWebpack\\my_node_modules\\lzy-React\\out\\V2\\myJSX\\createElement.js","../myJSX/updateFiberTree.js":"E:\\My_Webpack\\myWebpack\\my_node_modules\\lzy-React\\out\\V2\\myJSX\\updateFiberTree.js","./Reconciler.js":"E:\\My_Webpack\\myWebpack\\my_node_modules\\lzy-React\\out\\V2\\myReactCore\\Reconciler.js","./GlobalFiber.js":"E:\\My_Webpack\\myWebpack\\my_node_modules\\lzy-React\\out\\V2\\myReactCore\\GlobalFiber.js"} 
 ],
"E:\\My_Webpack\\myWebpack\\my_node_modules\\lzy-React\\out\\V2\\myReactCore\\GlobalFiber.js":[
 (require,module,exports)=>{
            "use strict";

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FiberNode = exports.updateWorkInProgressHook = exports.global = void 0; //! ----------Fiber节点结构---------------

var FiberNode = /*#__PURE__*/_createClass(function FiberNode(fiberFlags, $fiber) {
  _classCallCheck(this, FiberNode);

  this.memorizedState = null, // fiber上的所有hook链表
  this.tag = null, this.stateNode = null, // 对应的函数组件 或者Dom节点
  this.updateQueue = null, // Effects的更新链表
  this.stateQueueTimer = null, // 用于state的合并更新(setTimeout)
  this.fiberFlags = fiberFlags, // fiber的生命周期 判断是否初始化
  // this.effectTag = undefined, //  用于标记需要执行的Effect 执行对应操作
  this.hasRef = false, //ref相关tag
  this.text = null, this.sourcePool = null, ///! 组件返回的资源  props和事件
  this.hookIndex = 0, // 用于记录hook的数量 以便查找
  this.nodeType = undefined, this.$fiber = $fiber, // 用于识别fiber是哪颗树
  this.alternate = null, // 对面fiber树对应的节点
  this._child = null, this._sibling = null, this._parent = null;
});

exports.FiberNode = FiberNode; //! -----挂载需要使用的全局变量---------------

var global = {
  workInprogressFiberNode: null,
  workInProgressHook: {
    currentHook: null
  },
  EffectList: {
    firstEffect: null,
    lastEffect: null,
    length: 0
  },
  destoryEffectsArr: [],
  renderTag: 'mount' // 用于判断是否是首次更新

};
exports.global = global; //! ----------拿取需要本次update需要更新的hook----------------------

function updateWorkInProgressHook(fiber) {
  var index = fiber.hookIndex;
  var currentHook = fiber.memorizedState;

  while (currentHook && currentHook.index != index) {
    currentHook = currentHook.next;
  } // 因为链表是按顺序的 所以这个函数每执行一次就新增一个


  fiber.hookIndex += 1;
  return currentHook;
}

exports.updateWorkInProgressHook = updateWorkInProgressHook;
        } ,
 {} 
 ],
"E:\\My_Webpack\\myWebpack\\my_node_modules\\lzy-React\\out\\V2\\myRekV\\index.js":[
 (require,module,exports)=>{
            "use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Rekv = void 0;

var useState_1 = require("../myHook/useState.js");

var useEffect_1 = require("../myHook/useEffect.js"); // ----------------------使用的工具函数0-------------------


var utils_1 = require("./utils.js");

var Rekv = /*#__PURE__*/function () {
  // 构造函数
  function Rekv(args) {
    var _this = this;

    _classCallCheck(this, Rekv);

    this.delegate = {}; // 拦截器

    this._events = {}; // 键值对  根据不同key存放对应的updater数组

    this._updateId = 0; // updater的ID 用于优化类组件

    this._state = {}; // 全局state

    this._inDelegate = false; // 拦截器相关
    //todo ---------传入state的key  使用useEffect监听_state中的[key] ---------------- 

    this.useState = function () {
      for (var _len = arguments.length, keys = new Array(_len), _key = 0; _key < _len; _key++) {
        keys[_key] = arguments[_key];
      }

      var _ref = (0, useState_1.myUseState)(_this._state),
          _ref2 = _slicedToArray(_ref, 2),
          value = _ref2[0],
          setValue = _ref2[1]; //!_state对象
      //声明updater   


      var updater = function updater() {
        setValue(_this._state);
      }; //todo 监听keys数组  对其中每个添加/删除listener(on/off)


      (0, useEffect_1.myUseEffect)(function () {
        for (var i = 0, len = keys.length; i < len; i++) {
          _this.on(keys[i], updater);
        }

        return function () {
          for (var _i2 = 0, _len2 = keys.length; _i2 < _len2; _i2++) {
            _this.off(keys[_i2], updater);
          }
        };
      }, keys);
      return _this._state; //todo 直接返回当前状态
    };

    if (!(0, utils_1.isPlainObject)(args.allStates)) {
      throw new Error('init state is not a plain object');
    }

    this._state = args.allStates;
    var effects = {}; // 如果传入了effect项  则遍历里面的函数并call  

    if (args.effects) {
      var effectKeys = Object.keys(args.effects);

      var _loop = function _loop(i, len) {
        var key = effectKeys[i];
        var func = args.effects[key];

        args.effects[key] = function () {
          for (var _len3 = arguments.length, args = new Array(_len3), _key2 = 0; _key2 < _len3; _key2++) {
            args[_key2] = arguments[_key2];
          }

          return func.call.apply(func, [_this].concat(args));
        }; //bind

      };

      for (var i = 0, len = effectKeys.length; i < len; i++) {
        _loop(i, len);
      }
    } // 绑定effects到实例上


    this.effects = args.effects || effects;
  } //todo 使用添加一个listener(callback)  cb类型为<initState[K]>
  //todo 每次执行on 都会往_event中推入一个[name]:updater项


  _createClass(Rekv, [{
    key: "on",
    value: function on(name, callback) {
      var s = this._events[name]; // _events =  {'name':undefined}

      if (!s) {
        // 如果event中没有[name]属性  则将callback作为数组存入_event[name]
        this._events[name] = [callback]; // _events =  {'name':[setValue(name1),setValue(name2)]}
      } else if (s.indexOf(callback) < 0) {
        // 如果有[name]属性  且其中无cb  则存入cb
        s.push(callback);
      }
    } // 从_event[name]中移除callback(listener)

  }, {
    key: "off",
    value: function off(name, callback) {
      var s = this._events[name];
      this._events[name] = [callback];

      if (s) {
        var index = s.indexOf(callback);

        if (index >= 0) {
          s.splice(index, 1);
        }
      }
    } //! --------- 两种setState方法  传入{...states} 或者(state)=> ({...states})---------

  }, {
    key: "setState",
    value: function setState(param) {
      var kvs; // {...states}
      //todo 将state保存到kvs上

      if ((0, utils_1.isFunction)(param)) {
        kvs = param(this._state);
      } else {
        kvs = param;
      } //todo 开启beforeUpdate拦截器(无则不开启)  执行对应逻辑


      if (!this._inDelegate) {
        this._inDelegate = true;

        if (this.delegate && (0, utils_1.isFunction)(this.delegate.beforeUpdate)) {
          var ret = this.delegate.beforeUpdate({
            store: this,
            state: kvs
          });

          if (ret) {
            kvs = ret;
          }
        }

        if (Rekv.delegate && (0, utils_1.isFunction)(Rekv.delegate.beforeUpdate)) {
          var _ret = Rekv.delegate.beforeUpdate({
            store: this,
            state: kvs
          });

          if (_ret) {
            kvs = _ret;
          }
        }

        this._inDelegate = false;
      } //todo 传入的states对象做类型判断


      if (!(0, utils_1.isPlainObject)(kvs)) {
        // {...states}
        throw new Error('setState() only receive an plain object');
      }

      var keys = Object.keys(kvs);
      var needUpdateKeys = [];
      var updatedValues = {}; //todo 前后states对象进行遍历对比(for循环)  

      for (var i = 0, len = keys.length; i < len; i++) {
        var key = keys[i];

        if (this._state[key] !== kvs[key]) {
          //todo 不同的属性
          needUpdateKeys.push(key); // key推入needUpdateKeys数组 //!最小量更新

          updatedValues[key] = kvs[key]; // value推入updatedValue数组

          this._state[key] = kvs[key]; // 更新_state
        }
      } //todo 如果有需要更新的state（needUpdateKeys.length > 0）


      if (needUpdateKeys.length > 0) {
        this._state = Object.assign({}, this._state); // 拷贝

        this.updateComponents.apply(this, needUpdateKeys);
      } //todo 开启afterUpdate拦截器(无则不开启)  执行对应逻辑


      if (!this._inDelegate) {
        this._inDelegate = true;

        if (this.delegate && (0, utils_1.isFunction)(this.delegate.afterUpdate)) {
          this.delegate.afterUpdate({
            store: this,
            state: updatedValues
          });
        }

        if (Rekv.delegate && (0, utils_1.isFunction)(Rekv.delegate.afterUpdate)) {
          Rekv.delegate.afterUpdate({
            store: this,
            state: updatedValues
          });
        }

        this._inDelegate = false;
      }
    } //todo 作为对象的getter

  }, {
    key: "currentState",
    get: function get() {
      return this._state;
    } //todo------------ 直接返回_state----------------------

  }, {
    key: "getCurrentState",
    value: function getCurrentState() {
      return this._state;
    } //todo -------------更新组件  传入needUpdate数组的keys---------------------

  }, {
    key: "updateComponents",
    value: function updateComponents() {
      //todo batch函数将内部所有的setValue合并到一个setValue执行(react底层方法)
      //! 暂时废弃
      for (var i = 0, keysLen = arguments.length; i < keysLen; i++) {
        var key = i < 0 || arguments.length <= i ? undefined : arguments[i]; //'name'
        //todo 每次执行on 都会往_event中推入一个[name]:updater项

        var updaters = this._events[key]; //取出该key的updater

        if (Array.isArray(updaters)) {
          for (var j = 0, updaterLen = updaters.length; j < updaterLen; j++) {
            var updater = updaters[j]; // check whether the updater has been updated, the same updater may watch different keys

            updater.updateId = this._updateId; //! 隐式挂一个id属性

            updater(this._state[key]);
          }
        }
      } //todo----------- 每次更新id++  防止栈溢出----------------------


      this._updateId++; // istanbul ignore next

      if (this._updateId >= 2147483647) {
        // _updateId will be reset to zero to avoid overflow (2147483647 is 2**31-1)
        this._updateId = 0;
      }
    }
  }]);

  return Rekv;
}();

exports.Rekv = Rekv; // 定义类中需要使用的数据

Rekv.delegate = {};
exports["default"] = Rekv;
        } ,
 {"../myHook/useState.js":"E:\\My_Webpack\\myWebpack\\my_node_modules\\lzy-React\\out\\V2\\myHook\\useState.js","../myHook/useEffect.js":"E:\\My_Webpack\\myWebpack\\my_node_modules\\lzy-React\\out\\V2\\myHook\\useEffect.js","./utils.js":"E:\\My_Webpack\\myWebpack\\my_node_modules\\lzy-React\\out\\V2\\myRekV\\utils.js"} 
 ],
"E:\\My_Webpack\\myWebpack\\my_node_modules\\lzy-React\\out\\V2\\myJSX\\createElement.js":[
 (require,module,exports)=>{
            "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createBinadyElementTree = exports.transformElementTreeToBinadyTree = exports.createElement = void 0; // 判断是否为Element

function isElement(node) {
  if (!node.$$typeof) return false;
  return Symbol.keyFor(node.$$typeof) === 'lzyElement';
} // 给节点添加child和sibling,parent三个属性 放到connect属性里作为二叉树链接


function addPropsToElement(elementNode, parentNode) {
  Object.assign(elementNode, {
    _child: undefined,
    _sibling: undefined,
    _parent: parentNode
  });
} // 通过解析来的JSX创建Element树


function createElement() {
  var key;
  var ref;
  var children = [];

  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  var tag = args[0];
  var config = args[1];
  var childNodes = args.slice(2); // 处理tag为函数组件的情况(创建组件Element  执行函数并返回ElementNode)

  if (typeof tag === 'function') {
    var fc = tag;
    return {
      $$typeof: Symbol["for"]('lzyElement'),
      tag: fc.name,
      ref: fc,
      key: key,
      props: config,
      children: [],
      fiber: undefined
    };
  } // 单独处理ref和key


  if (config) {
    ref = config.ref;
    key = config.key; // 删除属性

    config === null || config === void 0 ? true : delete config.ref;
    config === null || config === void 0 ? true : delete config.key;
  } // 遍历处理childrenNode


  if (childNodes.length > 0) {
    childNodes.forEach(function (child) {
      if (isElement(child)) {
        children.push(child);
      } else {
        children.push({
          $$typeof: Symbol["for"]('lzyElement'),
          tag: 'text',
          text: child,
          fiber: undefined
        });
      }
    });
  } //返回生成的虚拟dom


  return {
    $$typeof: Symbol["for"]('lzyElement'),
    tag: tag,
    ref: ref,
    key: key,
    props: config,
    children: children,
    fiber: undefined
  };
}

exports.createElement = createElement; //! 将ElementTree森林结构递归转为二叉Element树

function transformElementTreeToBinadyTree(elementTree, parentElement) {
  var rootElementNode = elementTree;
  var children = rootElementNode.children;
  addPropsToElement(rootElementNode, parentElement);
  children.forEach(function (child, index) {
    addPropsToElement(child, rootElementNode);

    if (index === 0) {
      rootElementNode._child = child;
      delete rootElementNode.children;
    } else {
      children[index - 1]._sibling = child;
      delete children[index - 1].children;
    }

    if (child.children) {
      transformElementTreeToBinadyTree(child, rootElementNode);
    }
  });
  return rootElementNode;
}

exports.transformElementTreeToBinadyTree = transformElementTreeToBinadyTree; //! 综合方法

function createBinadyElementTree(functionComponent, parentElement) {
  var elementTree = createElement(functionComponent);
  var binadyElementTree = transformElementTreeToBinadyTree(elementTree, parentElement);
  return binadyElementTree;
}

exports.createBinadyElementTree = createBinadyElementTree; // 测试函数

var test = function test() {
  function App() {
    return /*#__PURE__*/createElement("div", null, "123", /*#__PURE__*/createElement("div", {
      id: 1
    }, "1"), /*#__PURE__*/createElement("div", {
      id: 1
    }, "1"));
  }

  var res = App();
  console.log(res);
};
        } ,
 {} 
 ],
"E:\\My_Webpack\\myWebpack\\my_node_modules\\lzy-React\\out\\V2\\myJSX\\createFiberTree.js":[
 (require,module,exports)=>{
            "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createFiberWorkLoop = exports.createFiberWorkLoop2 = exports.handleProps = exports.createTextElement = exports.createDomElement = exports.createAlternate = exports.createFiberTree = void 0;

var GlobalFiber_1 = require("../myReactCore/GlobalFiber.js");

var createElement_1 = require("../myJSX/createElement.js"); //! ---------------初始创建fiberTree--------------------


function createFiberTree(elementNode, parentFiber) {
  var newFiberNode = new GlobalFiber_1.FiberNode('mount', '$1');
  var childElement = elementNode._child;
  var siblingElement = elementNode._sibling; //todo 切换当前工作fiber

  GlobalFiber_1.global.workInprogressFiberNode = newFiberNode;
  newFiberNode.tag = elementNode.tag;
  newFiberNode._parent = parentFiber;
  newFiberNode._element = elementNode;
  elementNode.fiber = newFiberNode; //如果tag大写 解析为FC组件节点 重新生成element  挂载props

  if (elementNode.tag[0] === elementNode.tag[0].toUpperCase()) {
    newFiberNode.nodeType = 'FunctionComponent';
    newFiberNode.stateNode = elementNode.ref;
    var childElementTree = elementNode.ref.call(undefined, elementNode.props); //! 挂载props

    childElement = (0, createElement_1.transformElementTreeToBinadyTree)(childElementTree, elementNode); //! 重新生成新的二叉element树

    elementNode._child = childElement;
  } //解析为text节点
  else if (elementNode.tag === 'text') {
    newFiberNode.nodeType = 'HostText';
    newFiberNode.text = elementNode.text;
    createTextElement(newFiberNode);
  } //解析为普通dom节点
  else {
    newFiberNode.nodeType = 'HostComponent';
    createDomElement(newFiberNode);
  } // 深度优先递归执行


  if (childElement) {
    var childFiber = createFiberTree(childElement, newFiberNode);
    newFiberNode._child = childFiber;
  }

  if (siblingElement) {
    var siblingFiber = createFiberTree(siblingElement, parentFiber);
    newFiberNode._sibling = siblingFiber;
  } // 更改状态


  newFiberNode.fiberFlags = 'update';
  return newFiberNode;
}

exports.createFiberTree = createFiberTree; //! -------------创建复制的alternate------------------

function createAlternate(currentFiber) {
  var alternateFiber = new GlobalFiber_1.FiberNode('mount', '$2');
  var child = currentFiber._child;
  var sibling = currentFiber._sibling; //! 将一些属性复制给workInProgress

  alternateFiber.stateQueueTimer = currentFiber.stateQueueTimer;
  alternateFiber.updateQueue = currentFiber.updateQueue;
  alternateFiber.hookIndex = currentFiber.hookIndex;
  alternateFiber.memorizedState = currentFiber.memorizedState;
  alternateFiber.nodeType = currentFiber.nodeType;
  alternateFiber.tag = currentFiber.tag;
  alternateFiber.text = currentFiber.text; //! 链接两个fiber 

  alternateFiber.alternate = currentFiber;
  currentFiber.alternate = alternateFiber; //! 链接parent

  if (currentFiber._parent) {
    alternateFiber._parent = currentFiber._parent.alternate;
    currentFiber._parent.alternate = alternateFiber._parent;
  } // 深度优先递归执行


  if (child) {
    var childAlternateFiber = createAlternate(child);
    alternateFiber._child = childAlternateFiber;
  }

  if (sibling) {
    var siblingAlternateFiber = createAlternate(sibling);
    alternateFiber._sibling = siblingAlternateFiber;
  } // 更改状态


  alternateFiber.fiberFlags = 'update';
  return alternateFiber;
}

exports.createAlternate = createAlternate; //! -------------创建html并挂载到fiber节点上--------------------

function createDomElement(fiber) {
  //找到父dom节点 将创建好的dom节点添加进去
  var parentDom = getParentDom(fiber);
  var domElement = document.createElement(fiber.tag);
  handleProps(fiber, domElement);
  parentDom.appendChild(domElement);
  fiber.stateNode = domElement;
  return domElement;
}

exports.createDomElement = createDomElement; //! -------------创建text节点并挂载到fiber节点上--------------------

function createTextElement(fiber) {
  //找到父dom节点 将创建好的dom节点添加进去
  var parentDom = getParentDom(fiber);
  var textElement = document.createTextNode(fiber.text);
  parentDom.appendChild(textElement);
  fiber.stateNode = textElement;
  return textElement;
}

exports.createTextElement = createTextElement; //! ----------找到父dom节点---------------------

function getParentDom(fiber) {
  var parentNode = fiber._parent;
  var parentDom = parentNode === null || parentNode === void 0 ? void 0 : parentNode.stateNode;

  if (!parentNode) {
    return document.getElementById('root');
  }

  while (typeof parentDom === 'function') {
    parentNode = parentNode._parent;

    if (!parentNode) {
      return document.getElementById('root');
    }

    parentDom = parentNode.stateNode;
  }

  return parentDom;
} //! 对标签中的属性进行处理 给dom节点添加标签 (未完成)


function handleProps(fiber, dom) {
  var props = fiber._element.props;

  for (var key in props) {
    var value = props[key];

    switch (key) {
      //todo  处理className 
      case 'className':
        dom.setAttribute("class", value);
        break;
      //todo  处理class

      case 'class':
        dom.setAttribute("class", value);
        break;
      //todo  处理点击事件(还需处理其他事件)

      case 'onClick':
        dom.onclick = value;
        break;
      //todo  处理其他

      default:
        dom.setAttribute(key, value);
        break;
    }
  }
}

exports.handleProps = handleProps; //todo 深度优先遍历  优先进入child  再进入sibling 都无的情况返回parent 进入sibling （交替执行begin和completeWork）

function createFiberWorkLoop2(elementNode) {
  if (Symbol.keyFor(elementNode.$$typeof) === 'textElement') {
    console.log('执行completeWork', elementNode.$$typeof);

    if (elementNode._child) {
      createFiberWorkLoop(elementNode._child);
    }

    if (elementNode._sibling) {
      createFiberWorkLoop(elementNode._sibling);
    }
  } else {
    console.log('执行beginWork', elementNode.$$typeof);

    if (elementNode._child) {
      createFiberWorkLoop(elementNode._child);
    }

    if (elementNode._sibling) {
      createFiberWorkLoop(elementNode._sibling);
    }

    console.log('执行completeWork', elementNode.$$typeof);
  }
}

exports.createFiberWorkLoop2 = createFiberWorkLoop2; //todo 深度优先遍历  构建fiber树

function createFiberWorkLoop(elementNode) {
  console.log('执行beginWork', elementNode.$$typeof);

  if (elementNode._child) {
    console.log('进入child');
    createFiberWorkLoop(elementNode._child);
  }

  if (elementNode._sibling) {
    console.log('进入sibling');
    createFiberWorkLoop(elementNode._sibling);
  }
}

exports.createFiberWorkLoop = createFiberWorkLoop;

function test() {
  var obj = {
    $$typeof: Symbol('lzyElement'),
    tag: "div",
    props: null,
    children: [{
      $$typeof: Symbol('lzyElement'),
      tag: "div",
      props: {
        id: 1,
        name: "张三"
      },
      children: [{
        $$typeof: Symbol('lzyTextElement'),
        text: "文字内容"
      }, {
        $$typeof: Symbol('lzyElement'),
        tag: "div",
        props: {
          id: 1,
          name: "张三"
        },
        children: [{
          text: "1"
        }]
      }, {
        $$typeof: Symbol('lzyElement'),
        tag: "div",
        props: {
          id: 1,
          name: "张三"
        },
        children: [{
          text: "1"
        }]
      }, {
        $$typeof: Symbol('lzyElement'),
        tag: "div",
        props: null,
        children: [{
          text: "Child"
        }]
      }]
    }]
  };
  console.log((0, createElement_1.transformElementTreeToBinadyTree)(obj, 1));
}
        } ,
 {"../myReactCore/GlobalFiber.js":"E:\\My_Webpack\\myWebpack\\my_node_modules\\lzy-React\\out\\V2\\myReactCore\\GlobalFiber.js","../myJSX/createElement.js":"E:\\My_Webpack\\myWebpack\\my_node_modules\\lzy-React\\out\\V2\\myJSX\\createElement.js"} 
 ],
"E:\\My_Webpack\\myWebpack\\my_node_modules\\lzy-React\\out\\V2\\myJSX\\updateFiberTree.js":[
 (require,module,exports)=>{
            "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createAlternate = exports.updateFiberTree = void 0;

var GlobalFiber_1 = require("../myReactCore/GlobalFiber.js");

var createElement_1 = require("../myJSX/createElement.js"); //! ---------------更新fiberTree 遍历wk树 (在这里生成第二棵fiberTree)-------------------
//   (不需要更新跟组件节点的sibling节点  下层需要更新)


function updateFiberTree(newElementNode, workInProgressFiber, currentFiber, tag) {
  //todo 添加节点逻辑
  if (!currentFiber) {// const placementFiber = createFiberTree()
    // return placementFiber
  } //todo 删除节点逻辑


  if (!newElementNode) {
    console.log('无此节点', newElementNode, workInProgressFiber, currentFiber);
  } // 如果没有  生成一个alternate链接上去 


  if (!workInProgressFiber) {// workInProgressFiber = createAlternate(currentFiber)
  } // 链接element和节点


  workInProgressFiber._element = newElementNode;
  newElementNode.fiber = workInProgressFiber; // 切换当前工作fiber

  GlobalFiber_1.global.workInprogressFiberNode = workInProgressFiber; //如果tag大写 解析为FC组件节点

  if (newElementNode.tag[0] === newElementNode.tag[0].toUpperCase()) {
    workInProgressFiber.nodeType = 'FunctionComponent';
    workInProgressFiber.stateNode = newElementNode.ref; //! 挂载props(这里从alternate中获取  需要修改)

    var props = currentFiber._element.props;
    var childElementTree = newElementNode.ref.call(undefined, props);
    newElementNode._child = (0, createElement_1.transformElementTreeToBinadyTree)(childElementTree, newElementNode); //! 重新生成新的二叉element树 并链接 
  } //解析为text节点 挂载dom节点
  else if (newElementNode.tag === 'text') {
    workInProgressFiber.nodeType = 'HostText';
    workInProgressFiber.text = newElementNode.text;
    workInProgressFiber.stateNode = currentFiber.stateNode;
  } //解析为普通dom节点
  else {
    workInProgressFiber.nodeType = 'HostComponent';
    workInProgressFiber.stateNode = currentFiber.stateNode;
  } //深度优先递归执行


  if (newElementNode._child) {
    var childWkFiber = updateFiberTree(newElementNode._child, workInProgressFiber._child, currentFiber._child);
    workInProgressFiber._child = childWkFiber;
  }

  if (newElementNode._sibling && tag !== 'rootUpdateFiber') {
    // (不需要更新跟组件节点的sibling节点)
    var siblingWkFiber = updateFiberTree(newElementNode._sibling, workInProgressFiber._sibling, currentFiber._sibling);
    workInProgressFiber._sibling = siblingWkFiber;
  }

  return workInProgressFiber;
}

exports.updateFiberTree = updateFiberTree; //! ---------新建一个alternateFiber----------

function createAlternate(currentFiber) {
  //todo 新建一个fiberNode
  var workInProgressFiber = new GlobalFiber_1.FiberNode('update', '$2'); //! 将一些属性复制给workInProgress

  workInProgressFiber.stateQueueTimer = currentFiber.stateQueueTimer;
  workInProgressFiber.updateQueue = currentFiber.updateQueue;
  workInProgressFiber.hookIndex = currentFiber.hookIndex;
  workInProgressFiber.memorizedState = currentFiber.memorizedState;
  workInProgressFiber.nodeType = currentFiber.nodeType;
  workInProgressFiber.tag = currentFiber.tag; //! 链接两个fiber 

  workInProgressFiber.alternate = currentFiber;
  currentFiber.alternate = workInProgressFiber; //! 链接parent

  if (currentFiber._parent) {
    workInProgressFiber._parent = currentFiber._parent.alternate;
    currentFiber._parent.alternate = workInProgressFiber._parent;
  }

  return workInProgressFiber;
}

exports.createAlternate = createAlternate; //! 创建Placement的fiberNode  类似createFiberTree

function placementFiberTree(source, resources, parentNode) {
  //todo 创建一个新的fiber节点(浅拷贝) 更新当前工作节点
  var newFiberNode = new NewFiberNode('mount', parentNode.$fiber); //todo 预处理Fiber  生成vnode 挂载resource

  var _preHandleFiberNode = preHandleFiberNode(source, resources, newFiberNode),
      children = _preHandleFiberNode.children,
      tag = _preHandleFiberNode.tag; //todo 挂载父节点


  newFiberNode.parentNode = parentNode; //TODO -----------如果tag大写 解析为组件节点(无children) ----------------

  if (tag[0] === tag[0].toUpperCase()) {
    //! 处理为组件节点   并继续向下递归render子函数组件
    handleFunctionFiberNode(newFiberNode, tag);
    placementFunctionComponent(newFiberNode);
  } //TODO ----------小写的情况  是dom节点 创建Effect 交给commit阶段执行添加--------
  else {
    newFiberNode.nodeType = 'HostText';
  } //todo 继续向下深度优先递归  创建子fiber 挂到当前节点


  placementFiberTreeLoop(children, newFiberNode);
  newFiberNode.fiberFlags = 'update'; //适配路由

  useRoute(newFiberNode); //todo 在这里创建一个effect!

  return newFiberNode;
} //! 根据子vnode 递归创建创建Placement的fiberNode 并进行拼接-------------


function placementFiberTreeLoop(childVnodes, parentNode) {
  if (childVnodes.length > 0) {
    parentNode.nodeType = 'HostComponent';

    for (var i = 0; i < childVnodes.length; i++) {
      var childFiberNode = placementFiberTree(childVnodes[i], parentNode.sourcePool, parentNode);
      parentNode.children.push(childFiberNode);
    }
  }
} //! 添加函数组件节点


function placementFunctionComponent(fiber) {
  if (typeof fiber.stateNode !== 'function') return;

  var _fiber$stateNode = fiber.stateNode(),
      template = _fiber$stateNode.template,
      _fiber$stateNode$data = _fiber$stateNode.data,
      data = _fiber$stateNode$data === void 0 ? {} : _fiber$stateNode$data,
      _fiber$stateNode$comp = _fiber$stateNode.components,
      components = _fiber$stateNode$comp === void 0 ? {} : _fiber$stateNode$comp;

  var childFiberNode = placementFiberTree(template, {
    data: data,
    components: components
  }, fiber); //todo 生成子树并链接

  fiber.children = [childFiberNode];
}
        } ,
 {"../myReactCore/GlobalFiber.js":"E:\\My_Webpack\\myWebpack\\my_node_modules\\lzy-React\\out\\V2\\myReactCore\\GlobalFiber.js","../myJSX/createElement.js":"E:\\My_Webpack\\myWebpack\\my_node_modules\\lzy-React\\out\\V2\\myJSX\\createElement.js"} 
 ],
"E:\\My_Webpack\\myWebpack\\my_node_modules\\lzy-React\\out\\V2\\myReactCore\\Reconciler.js":[
 (require,module,exports)=>{
            "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.reconcileUseEffect = exports.reconcileFiberNode = void 0;

var GlobalFiber_1 = require("./GlobalFiber.js"); //! 更新事件
// TODO (重要)如果节点有挂载事件  需要更新这些事件(否则无法更新  事件引用不会变更)!!!!!!!!!


function reconcileEvent(workInProgressFiber, currentFiber) {
  var _a;

  var wkProps = (_a = workInProgressFiber === null || workInProgressFiber === void 0 ? void 0 : workInProgressFiber._element) === null || _a === void 0 ? void 0 : _a.props;
  if (!wkProps) return; // 如果有事件 创建对应的Effect

  var hasEvent = wkProps.hasOwnProperty('onClick' || 'onMouseOver');

  if (hasEvent) {
    pushEffectList('Update', workInProgressFiber);
  }
} //! 判断是否有useEffect钩子调用


function reconcileUseEffect(workInProgressFiber, currentFiber) {
  var _a;

  if ((_a = workInProgressFiber === null || workInProgressFiber === void 0 ? void 0 : workInProgressFiber.updateQueue) === null || _a === void 0 ? void 0 : _a.lastEffect) {
    pushEffectList('UseEffect', workInProgressFiber);
  }
}

exports.reconcileUseEffect = reconcileUseEffect; //! 计算Text

function reconcileText(workInProgressFiber, currentFiber) {
  if (!workInProgressFiber || !currentFiber) return;

  if (workInProgressFiber.text !== currentFiber.text) {
    pushEffectList('Update', workInProgressFiber);
  }
} //! 计算tag


function reconcileTag(workInProgressFiber, currentFiber) {} //! 添加(待优化)


function reconcilePlacement(workInProgressFiber, currentFiber) {// const wkKey = workInProgressFiber?._element.key
  // const curKey = currentFiber?._element.key
  // 或者有cur  无work算为插入节点
  // if (!currentFiber && workInProgressFiber) {
  //     pushEffectList('Placement', workInProgressFiber)
  // }
} //! 删除


function reconcileDeletion(workInProgressFiber, currentFiber) {
  //todo wk没有节点 current有节点 删除current
  if (!workInProgressFiber && currentFiber) {
    pushEffectList('Delete', currentFiber);
    return false;
  } //todo 如果有key  且不一样 删除current 否则下一次会进行大量更新(需要重写)
  else if (workInProgressFiber.key || currentFiber.key) {
    if (workInProgressFiber.key !== currentFiber.key) {
      pushEffectList('Delete', currentFiber);
      return false;
    }
  }

  return true;
} //! 创建并添加Effect到EffectList


function pushEffectList(tag, targetFiber, callback) {
  var newEffect = {
    tag: tag,
    targetFiber: targetFiber,
    callback: '暂定',
    next: null
  }; //todo 链接到全局EffectList单链表

  var EffectList = GlobalFiber_1.global.EffectList;

  if (EffectList.firstEffect === null) {
    EffectList.firstEffect = newEffect;
    EffectList.lastEffect = newEffect;
  } else {
    EffectList.lastEffect.next = newEffect;
    EffectList.lastEffect = newEffect;
  }

  EffectList.length += 1;
} //! diff两个节点综合方法
//! ----------比较wk和cur两个fiber  生成不同的Effect (打上tag)-------------


function reconcileFiberNode(workInProgressFiber, currentFiber) {
  //TODO 开始先进行删除和添加的diff计算  (需要在最先进行 因为之后的就不需要进行了)
  reconcilePlacement(workInProgressFiber, currentFiber);
  var needDiff = true;

  if (workInProgressFiber && !currentFiber) {
    needDiff = false;
  } else if (!workInProgressFiber && currentFiber) {
    reconcileDeletion(workInProgressFiber, currentFiber);
    needDiff = false;
  } else if (workInProgressFiber.key !== currentFiber.key) {}

  if (needDiff) {
    // TODO 进行text的判断 生成Effect
    reconcileText(workInProgressFiber, currentFiber); //TODO 有事件更新事件

    reconcileEvent(workInProgressFiber, currentFiber);
  }
}

exports.reconcileFiberNode = reconcileFiberNode;
        } ,
 {"./GlobalFiber.js":"E:\\My_Webpack\\myWebpack\\my_node_modules\\lzy-React\\out\\V2\\myReactCore\\GlobalFiber.js"} 
 ],
"E:\\My_Webpack\\myWebpack\\my_node_modules\\lzy-React\\out\\V2\\myRekV\\utils.js":[
 (require,module,exports)=>{
            "use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isPlainObject = exports.isFunction = void 0;

function isFunction(fn) {
  return typeof fn === 'function';
}

exports.isFunction = isFunction; // 判断是否是原始对象(未包装过的对象)

function isPlainObject(obj) {
  if (_typeof(obj) !== 'object' || obj === null) return false; // 找到原型练最里层(Object原型对象)  如果传入对象的原型对象就是Object原型对象 那么就是原始对象
  //原始对象: 未经过包装的对象(比如vue的包装后的对象)

  var proto = obj;

  while (Object.getPrototypeOf(proto) !== null) {
    proto = Object.getPrototypeOf(proto);
  }

  return Object.getPrototypeOf(obj) === proto;
}

exports.isPlainObject = isPlainObject;
        } ,
 {} 
 ],
}
                
                //todo 这里需要一个module缓存
                var modulesCache = {};
    
                //todo 创建require函数 获取modules的函数代码和mapping对象
                function require(absolutePath){
                    const [fn,mapping]  = modules[absolutePath]
    
                    //! 构造fn所需的require函数(loaclRequire 通过相对路径获取绝对路径(id)并执行require)
                    const loaclRequire =(relativePath)=>{  
                        return  require(mapping[relativePath])
                    }
    
                    //!查看缓存中是否有模块 构造模拟Node的module对象  (多个模块同时引用一个module   都需要从缓存中拿取  否则会创建一个新的module 导致引用不一致)
                    var cachedModule = modulesCache[absolutePath];
                    if (cachedModule !== undefined) return cachedModule.exports;
    
                    //! 如果模块不存在  创建一个新的module到缓存
                    var module = modulesCache[absolutePath] = {
                        exports: {}
                    };
    
                    //! 将三个参数传入fn并执行
                    fn.apply(null, [loaclRequire, module, module.exports])
    
                    //! 将本模块导出的代码返回
                    //todo 上面fn中传入了module.export,转换后的ES5代码会识别export关键字  
                    return module.exports
                }
    
                //! 执行require(entry)入口模块
                 require("E:\\My_Webpack\\myWebpack\\src\\index.js")
            })();