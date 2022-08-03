
    // -------------------泽亚的webpack---------------------------
        (()=>{
            //todo 传入modules
            var modules = {"E:\\My_Webpack\\myWebpack\\src\\index.js":[
 (require,module,exports)=>{
            "use strict";

var _App = require("./tinyReact/App.lzy");

(0, _App.render)(_App.Demo, document.getElementById('root'));
        } ,
 {"./tinyReact/App.lzy":"E:\\My_Webpack\\myWebpack\\src\\tinyReact\\App.lzy"} 
 ],
"E:\\My_Webpack\\myWebpack\\src\\tinyReact\\App.lzy":[
 (require,module,exports)=>{
            "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Demo = Demo;
Object.defineProperty(exports, "render", {
  enumerable: true,
  get: function get() {
    return _lzyReactDevelpoment.render;
  }
});

var _lzyReactDevelpoment = require("../../lzy-React/lzy-react-develpoment.js");

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

function Demo(props) {
  console.log('组件props', props);

  var _myUseState = (0, _lzyReactDevelpoment.myUseState)(18),
      _myUseState2 = _slicedToArray(_myUseState, 2),
      age = _myUseState2[0],
      setAge = _myUseState2[1];

  var _myUseState3 = (0, _lzyReactDevelpoment.myUseState)(0),
      _myUseState4 = _slicedToArray(_myUseState3, 2),
      num = _myUseState4[0],
      setNum = _myUseState4[1];

  var _myUseState5 = (0, _lzyReactDevelpoment.myUseState)([]),
      _myUseState6 = _slicedToArray(_myUseState5, 2),
      arr = _myUseState6[0],
      setArr = _myUseState6[1]; //! 支持useEffect全系使用(return函数 同样会发生死循环)


  (0, _lzyReactDevelpoment.myUseEffect)(function () {
    console.log('传入[],仅仅mount时执行');
  }, []);
  (0, _lzyReactDevelpoment.myUseEffect)(function () {
    console.log('不传 任意时候执行');
  });
  (0, _lzyReactDevelpoment.myUseEffect)(function () {
    setNum(num + 1);
    console.log('监听age,age改变时执行');
  }, [age]); //!定义onclick方法

  function addNum() {
    setNum(num + 1); //setArr并不是异步的  而是在App执行完毕之后才会进行更新
  }

  function addAge() {
    setAge(age + 1);
    setNum(num + 1);
  }

  function addArr() {
    setArr([].concat(_toConsumableArray(arr), ['item']));
  }

  function minArr() {
    setArr(arr.splice(1));
  }

  return {
    components: {},
    data: {
      addNum: addNum,
      addAge: addAge,
      addArr: addArr,
      minArr: minArr
    },
    template: "<div>\n            <h1> Demo</h1>\n\n            <div>\u7B80\u5355\u9002\u914D\u4E86bootStarp\u7EC4\u4EF6\u5E93</div>\n            <button type=\"button\" class=\"btn btn-primary\" onClick={addNum}>\u589E\u52A0Num</button>\n            <button type=\"button\" class=\"btn btn-secondary\" onClick={addAge}>\u589E\u52A0Age\u548CNum</button>\n            <button type=\"button\" class=\"btn btn-success\" onClick={addArr}>\u589E\u52A0Arr</button>\n            <button type=\"button\" class=\"btn btn-warning\" onClick={minArr}>\u51CF\u5C11Arr</button>\n\n            <h3 className=\"blue\">\u5F53\u524DNum:".concat(num, "</h3>\n            <h3 className='blue'>\u5F53\u524DAge:").concat(age, "</h3>\n\n            <h4 className='red'>\u5217\u8868\u6E32\u67D3\u6D4B\u8BD5</h4>\n\n            ").concat(arr.map(function (item) {
      return "<div>".concat(item, "</div>");
    }), "\n\n        </div>")
  };
}
        } ,
 {"../../lzy-React/lzy-react-develpoment.js":"E:\\My_Webpack\\myWebpack\\lzy-React\\lzy-react-develpoment.js"} 
 ],
"E:\\My_Webpack\\myWebpack\\lzy-React\\lzy-react-develpoment.js":[
 (require,module,exports)=>{
            "use strict";

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.global = exports.updateRender = exports.render = exports.myUseEffect = exports.myUseState = void 0; //! ----------Fiber节点结构---------------

var NewFiberNode = /*#__PURE__*/_createClass(function NewFiberNode(fiberFlags, $fiber) {
  _classCallCheck(this, NewFiberNode);

  this.memorizedState = null, // fiber上的所有hook链表
  this.stateNode = null, // 对应的函数组件 或者Dom节点
  this.updateQueue = null, // Effects的更新链表
  this.stateQueueTimer = null, // 用于state的合并更新(setTimeout)
  this.fiberFlags = fiberFlags, // fiber的生命周期 判断是否初始化
  // this.effectTag = undefined, //  用于标记需要执行的Effect 执行对应操作
  this.hasRef = false, //ref相关tag
  this.ref = null, this.children = [], this.props = null, this.tag = null, // 节点的tag 比如div/Demo
  this.text = null, this.sourcePool = null, ///! 组件返回的资源  props和事件
  this.hookIndex = 0, // 用于记录hook的数量 以便查找
  this.parentNode = null, this.nodeType = undefined, this.alternate = null, // 对面fiber树对应的节点
  this.$fiber = $fiber, // 用于识别fiber是哪颗树
  this.key = null; // 用于进行列表的diff
}); //! -----需要使用的全局变量---------------


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
} //! -------mountEffect(useEffect第一次执行)-------------


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
  var fiber = global.workInprogressFiberNode; //! 测试
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

  global.workInProgressHook.currentHook = newHook;
  return newHook;
} //! -------updateEffect(useEffect后续更新)-------------


function updateEffect(fiberFlags, hookFlags, create, deps) {
  var fiber = global.workInprogressFiberNode; //! 测试

  var currentHook = updateWorkInProgressHook(fiber); //判断是否传入deps 不同时机执行useEffect

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
  var fiber = global.workInprogressFiberNode; //! 测试
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
  var fiber = global.workInprogressFiberNode; //! 测试
  // 第一次useEffect执行mountEffect

  if (fiber.fiberFlags === 'mount') {
    var hookFlags = 'mount';
    mountEffect('mount', hookFlags, create, nextDeps); // 后续useEffect执行updateEffect
  } else if (fiber.fiberFlags === 'update') {
    var _hookFlags = 'update';
    updateEffect('update', _hookFlags, create, nextDeps);
  } //创建一个新的Effect项 推入全局EffectList中 

}

exports.myUseEffect = myUseEffect; //! ---------------useState返回的updater方法(updateState方法)-------------------

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
      updateRender(curFiber.stateNode, wkInFiber, curFiber);
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
  var fiber = global.workInprogressFiberNode; //! 测试
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
    global.workInProgressHook.currentHook = hook;
  } else {
    var lastEffect = fiber.memorizedState;
    hook.next = lastEffect;
  }

  global.workInProgressHook.currentHook = hook;
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
  var fiber = global.workInprogressFiberNode; //取出当前hook 如果是mount阶段就创建一个hook(初始值为initState)

  var hook;

  if (fiber.fiberFlags === 'mount') {
    hook = createHook(initialState); //创建hook 添加到hook链表
  } else {
    // 更新情况 找到对应的hook
    hook = updateWorkInProgressHook(fiber);
  } //todo 更新hook上保存的state


  var baseState = updateUseStateHook(hook); //todo 执行完useState 钩子状态变为update

  hook.hookFlags = 'update'; //todo 返回最新的状态 和updateAction 
  //todo bind本次useState的fiber节点 用于从当前组件开始更新

  return [baseState, dispatchAction.bind(null, hook.updateStateQueue, fiber)];
}

exports.myUseState = myUseState; //! 更新事件

function reconcileEvent(workInProgressFiber, currentFiber) {
  // TODO 如果节点有挂载事件  需要更新这些事件!!!!!!!!!
  var wkProps = workInProgressFiber.props;
  if (!wkProps) return; // 如果有事件 创建对应的Effect

  var hasEvent = wkProps.hasOwnProperty('onClick' || 'onMouseOver');

  if (hasEvent) {
    pushEffectList('Update', workInProgressFiber);
  }
} //! 判断是否有useEffect钩子调用


function reconcileUseEffect(workInProgressFiber, currentFiber) {
  if (workInProgressFiber.updateQueue) {
    pushEffectList('UseEffect', workInProgressFiber);
  }
} //! 计算Props


function reconcileProps(workInProgressFiber, currentFiber) {
  pushEffectList('Update', workInProgressFiber);
} //! 计算Text


function reconcileText(workInProgressFiber, currentFiber) {
  if (!workInProgressFiber.text || !currentFiber.text) return;

  if (workInProgressFiber.text !== currentFiber.text) {
    pushEffectList('Update', workInProgressFiber);
  }
} //! 计算tag


function reconcileTag(workInProgressFiber, currentFiber) {} //! 添加(待优化)


function reconcilePlacement(workInProgressFiber, currentFiber) {
  var wkKey = workInProgressFiber === null || workInProgressFiber === void 0 ? void 0 : workInProgressFiber.key;
  var curKey = currentFiber === null || currentFiber === void 0 ? void 0 : currentFiber.key; // 或者有cur  无work算为插入节点

  if (!currentFiber && workInProgressFiber) {
    pushEffectList('Placement', workInProgressFiber);
  }
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

  var EffectList = global.EffectList;

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
    // reconcilePlacement(workInProgressFiber, currentFiber)
    needDiff = false;
  } else if (!workInProgressFiber && currentFiber) {
    reconcileDeletion(workInProgressFiber, currentFiber);
    needDiff = false;
  } else if (workInProgressFiber.key !== currentFiber.key) {}

  if (needDiff) {
    // TODO 进行text的判断 生成Effect
    reconcileText(workInProgressFiber, currentFiber); //TODO 有事件更新事件

    reconcileEvent(workInProgressFiber, currentFiber); //TODO 判断是否使用了useEffect

    reconcileUseEffect(workInProgressFiber, currentFiber);
  }
} //! ----------------模拟render部分------------------------
//! 更改并生成fiber树  (结束后fiber由mount变为update)


function renderPart(functionComponent, rootDom, workInProgress) {
  //todo 通过functionComponents生成第一个组件节点 如App
  var _firstRenderApp = firstRenderApp(functionComponent, workInProgress, rootDom),
      template = _firstRenderApp.template,
      resource = _firstRenderApp.resource,
      currentRootFiber = _firstRenderApp.currentRootFiber; //todo根据组件构建fiberTree(首次)


  var fiberTree = createFiberTree(template, resource, currentRootFiber);
  currentRootFiber.children.push(fiberTree);
  return currentRootFiber;
} //todo 获取上一次的fiberTree 执行所有打上tag的functionComponent进行state更新 再commit   


function updateRenderPart(functionComponent, workInProgressFiber, currentFiber) {
  // 改变tag
  global.renderTag = 'update'; // 处理根App节点 并链接两个节点

  var _firstUpdateRenderApp = firstUpdateRenderApp(functionComponent, workInProgressFiber, currentFiber),
      template = _firstUpdateRenderApp.template,
      resource = _firstUpdateRenderApp.resource,
      workInProgressRootFiber = _firstUpdateRenderApp.workInProgressRootFiber; // 更新函数组件(因为处理了根节点 从根节点的第一个子节点开始递归)


  var secondWorkInProgress = workInProgressRootFiber.children[0];
  var secondCurrent = currentFiber.children[0]; // 此时不需要创建fiberNode  所以不需要添加childFiber  直接在根fiber树上更新

  var childFiber = updateFiberTree(template, resource, workInProgressRootFiber, secondWorkInProgress, secondCurrent);

  if (workInProgressRootFiber.children.length === 0) {
    workInProgressRootFiber.children = [childFiber];
  }

  return workInProgressRootFiber;
} //todo修补用工具函数对render根Fiber节点进行处理(否则无法渲染第一个根节点)


function firstRenderApp(functionComponent, currentRootFiber, rootDom) {
  global.workInprogressFiberNode = currentRootFiber;
  currentRootFiber.stateNode = functionComponent;
  currentRootFiber.nodeType = 'AppNode'; //! 用于解决webpack 函数名出现bound问题 并赋值给此fiber的tag

  var functionNameArr = functionComponent.name.split(' ');
  currentRootFiber.tag = functionNameArr[0] === 'bound' ? functionNameArr[1] : functionNameArr[0]; //! 处理向下传递的resource

  var _functionComponent = functionComponent(),
      template = _functionComponent.template,
      data = _functionComponent.data,
      components = _functionComponent.components;

  var resource = {
    data: data,
    components: components
  };
  currentRootFiber.fiberFlags = 'update';
  return {
    template: template,
    resource: resource,
    currentRootFiber: currentRootFiber
  };
}

function firstUpdateRenderApp(functionComponent, workInProgressRootFiber, currentRootFiber) {
  if (!workInProgressRootFiber) {
    workInProgressRootFiber = firstCreateAlternate(currentRootFiber);
  }

  global.workInprogressFiberNode = workInProgressRootFiber;
  workInProgressRootFiber.stateNode = functionComponent; //! 用于解决webpack 函数名出现bound问题

  var functionNameArr = functionComponent.name.split(' ');
  var functionName = functionNameArr[0] === 'bound' ? functionNameArr[1] : functionNameArr[0];
  workInProgressRootFiber.tag = functionName;

  var _functionComponent2 = functionComponent(),
      template = _functionComponent2.template,
      data = _functionComponent2.data,
      components = _functionComponent2.components;

  var resource = {
    data: data,
    components: components
  };
  return {
    template: template,
    resource: resource,
    workInProgressRootFiber: workInProgressRootFiber
  };
}

function firstCreateAlternate(currentRootFiber) {
  //todo 新建一个fiberNode
  var workInProgressRootFiber = new NewFiberNode('update', '$2'); //! 复制一些通用属性

  workInProgressRootFiber.stateQueueTimer = currentRootFiber.stateQueueTimer;
  workInProgressRootFiber.updateQueue = currentRootFiber.updateQueue;
  workInProgressRootFiber.hookIndex = currentRootFiber.hookIndex;
  workInProgressRootFiber.memorizedState = currentRootFiber.memorizedState;
  workInProgressRootFiber.nodeType = currentRootFiber.nodeType; //! 合并两个节点

  workInProgressRootFiber.alternate = currentRootFiber;
  currentRootFiber.alternate = workInProgressRootFiber;
  return workInProgressRootFiber;
} //! -----------------模拟Commit阶段-----------------------------
//! 分为三部分  beforeMutation  mutation  layout阶段
//! before 前置处理  mutation 渲染dom节点   layout  处理useEffect useLayoutEffect


function commitPart(finishedWorkFiber) {
  //todo  mutation阶段 
  commitFiberNodeMutation(global.EffectList); //todo  layout阶段  调用Effects链表 执行create函数()
  //todo 处理ref
}

function updateCommitPart(finishedWorkFiber) {
  //todo  mutation阶段 遍历EffectList单链表 预留优先级调用 更新fiber
  commitFiberNodeMutation(global.EffectList); //todo  layout阶段  调用Effects链表 执行create函数()
  //todo 处理ref
} //! mutation阶段  遍历EffectList  对每个节点执行更新(分为添加  删除  更新 三大部分 )


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
  createDomElement(finishedWorkFiber);
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
  } //从父节点处遍历删除该节点


  var parentNode = currentFiber.parentNode;
  parentNode.children.forEach(function (childNode, index) {
    if (childNode === currentFiber) {
      parentNode.children.splice(index, 1);
    }
  });
} //todo 记录  我这里直接遍历fiber树  发现有需要变更的节点直接进行变更,
//todo 而react中在render阶段遍历 发现变更 打上tag  生成update , 推入effect链表中  为了实现优先级调度
// 错误记录 : 赋值dom节点新的text后   没有handleProps   
// 因为新的click函数的获取在这里   如果不执行  每次点击执行的都是上一次的点击事件 
// 所以不更新视图
// todo dom节点的更新


function commitUpdateDom(finishedWorkFiber) {
  var domElement = finishedWorkFiber.stateNode;
  if (typeof domElement === 'function') return;
  diffProps(finishedWorkFiber, domElement);
} //TODO text节点的更新


function commitUpdateText(finishedWorkFiber) {
  var domElement = finishedWorkFiber.stateNode;
  if (typeof domElement === 'function') return; // 这里更改的是dom.firstChild  会新建一个nodeValue
  //! 注意 这里需要处理props  不然点击事件不会更新  第二次点击num不会++  
  //! 点击时获取的num变量还是上一次的变量

  diffProps(finishedWorkFiber, domElement); // ! 比较text是否变化 变化则更改dom

  var fiberText = finishedWorkFiber.text;
  var domText = domElement.firstChild.nodeValue;

  if (domText !== fiberText) {
    console.log('更新text');
    domElement.firstChild.nodeValue = fiberText;
  }
} //! 对标签中的属性进行diff处理 (使用前后两棵fiber树进行diff)


function diffProps(curFiber, dom) {
  var props = curFiber.props;

  for (var key in props) {
    var value = props[key];

    switch (key) {
      //todo  处理className (合并所有的类名)
      case 'className':
        var classNameStr = '';

        for (var i = 0; i < value.length; i++) {
          classNameStr += value[i] + ' ';
        }

        dom.setAttribute("class", classNameStr.trim());
        break;
      //todo  处理class (合并所有的类名)

      case 'class':
        var classStr = '';

        for (var _i = 0; _i < value.length; _i++) {
          classStr += value[_i] + ' ';
        }

        dom.setAttribute("class", classStr.trim());
        break;
      //todo  处理点击事件

      case 'onClick':
        //! 从组件的资源池里找对应的事件
        var dataPool = curFiber.sourcePool.data;
        var callback = dataPool[value[0]];
        dom.onclick = callback; // 这里不能使用addEventListener  因为需要删除上一个点击事件

        break;
      //todo  处理其他

      default:
        dom.setAttribute(key, value[0]);
        break;
    }
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
  var isFiberMount = Boolean(global.renderTag === 'mount');
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
  var isFiberMount = Boolean(global.renderTag === 'mount');
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
  //TODO  这里相当于重置了updateQueue
  var root = workInProgressFiber;
  var rootUpdateQueue = {
    lastEffect: null
  }; // 首屏不需要diff  更新需要进行diff计算

  global.renderTag === 'mount' ? finishedWorkLoop(workInProgressFiber, rootUpdateQueue) : updateFinishedWorkLoop(workInProgressFiber, currentFiber, rootUpdateQueue); // 处理好的updateQueue成为到本次root节点的updateQueue

  root.updateQueue = rootUpdateQueue;
  return root;
} //! 遍历fiber  拼接所有的effect   


function finishedWorkLoop(workInProgressFiber, rootUpdateQueue) {
  // 拼接两个链表
  collectEffect(workInProgressFiber, rootUpdateQueue); // 继续遍历fiber树  拼接链表

  var wkChildren = workInProgressFiber.children;

  for (var i = 0; i < wkChildren.length; i++) {
    finishedWorkLoop(wkChildren[i], rootUpdateQueue);
  }
} //! 更新时的finishedWork


function updateFinishedWorkLoop(workInProgressFiber, currentFiber, rootUpdateQueue) {
  // 拼接两个链表
  collectEffect(workInProgressFiber, rootUpdateQueue); //TODO ---------diff两个节点 打上tag 生成Effect交给commit阶段更新------------

  reconcileFiberNode(workInProgressFiber, currentFiber); // 遍历fiber树 (最长遍历) (需要注意fiber为null的情况)

  var length;
  var wkChildren = [];
  var curChildren = [];

  if (workInProgressFiber && currentFiber) {
    wkChildren = workInProgressFiber.children;
    curChildren = currentFiber.children;
    length = wkChildren.length > curChildren.length ? wkChildren.length : curChildren.length;
  } else if (!workInProgressFiber) {
    curChildren = currentFiber.children;
    length = currentFiber.children.length;
  } else if (!currentFiber) {
    wkChildren = workInProgressFiber.children;
    length = workInProgressFiber.children.length;
  } // 继续遍历fiber树  拼接链表


  for (var i = 0; i < length; i++) {
    updateFinishedWorkLoop(wkChildren[i], curChildren[i], rootUpdateQueue);
  }
} //! 收集所有的Effect(hook)


function collectEffect(fiber, rootUpdateQueue) {
  if (!fiber) return;
  var fiberUpdateQueue = fiber.updateQueue;

  if (fiberUpdateQueue && fiberUpdateQueue.lastEffect) {
    rootUpdateQueue.lastEffect = fiberUpdateQueue.lastEffect;
    fiberUpdateQueue.lastEffect.next = rootUpdateQueue.lastEffect.next;
  }
} //!--------------综合Render方法-------------------


function render(functionComponent, rootDom) {
  console.log('------------render-------------'); //todo 初始化workInProgress树

  var workInProgressFiber = new NewFiberNode('mount', '$1');
  global.workInprogressFiberNode = workInProgressFiber; //挂载到全局
  //todo render阶段

  var beginWorkFiber = renderPart(functionComponent, rootDom, workInProgressFiber); // 从下往上遍历fiber收集所有的Effects 形成环链表 上传递优先级给root
  //! 这里finishedWork应该在renderPart中   待修改

  var finishedWorkFiber = finishedWork(beginWorkFiber, null); //todo commit阶段

  commitPart(finishedWorkFiber);
}

exports.render = render;

function updateRender(functionComponent, workInProgressFiber, currentFiber) {
  console.log('------------updateRender-------------');
  resetFiber(currentFiber); //更新render时需要先将fiber的数据重置  重新挂载数据

  if (workInProgressFiber) {
    resetFiber(workInProgressFiber); //更新render时需要先将fiber的数据重置  重新挂载数据
  } // 更新fiber树


  var beginWorkFiber = updateRenderPart(functionComponent, workInProgressFiber, currentFiber); // 从下往上遍历fiber收集所有的Effects 形成环链表 上传递优先级给root

  var finishedWorkFiber = finishedWork(beginWorkFiber, currentFiber);
  updateCommitPart(finishedWorkFiber);
}

exports.updateRender = updateRender; //todo ----遍历清空fiber树上的hookIndex 和 queue 和 EffectTag

function resetFiber(fiber) {
  fiber.hookIndex = 0;
  fiber.updateQueue = null;
  global.EffectList = {
    firstEffect: null,
    lastEffect: null,
    length: 0
  };
  global.destoryEffectsArr = [];

  if (fiber.children.length !== 0) {
    fiber.children.forEach(function (fiber) {
      resetFiber(fiber);
    });
  }
} //! 创建fiberNode树(Vnode树) 深度优先遍历vnode树  包装成fiberNode
//! 根据fiberNode和FunctionComponent创建FiberNode 生成Fiber树
//todo 传入parentNode 给子fiber挂载parentNode属性  用于向上查找dom节点和fiber


function createFiberTree(source, resources, parentNode) {
  //todo 创建一个新的fiber节点(浅拷贝) 更新当前工作节点
  var newFiberNode = new NewFiberNode('mount', '$1'); //todo 预处理Fiber  生成vnode 挂载resource

  var _preHandleFiberNode = preHandleFiberNode(source, resources, newFiberNode),
      children = _preHandleFiberNode.children,
      tag = _preHandleFiberNode.tag; //todo 挂载父节点


  newFiberNode.parentNode = parentNode; //TODO -----------如果tag大写 解析为组件节点(无children) ----------------

  if (tag[0] === tag[0].toUpperCase()) {
    //! 处理为组件节点   并继续向下递归render子函数组件
    handleFunctionFiberNode(newFiberNode, tag);
    renderFunctionComponent(newFiberNode);
  } //TODO ----------小写的情况  是domComponent节点/text节点  创建对应的dom并添加--------
  else {
    newFiberNode.nodeType = 'HostText';
    createDomElement(newFiberNode);
  } //todo 继续向下深度优先递归  创建子fiber 挂到当前节点


  createFiberTreeLoop(children, newFiberNode);
  newFiberNode.fiberFlags = 'update'; //模拟finishowrk
  // console.log('finishWork', newFiberNode.tag);
  //适配路由

  useRoute(newFiberNode);
  return newFiberNode;
} //! 根据子vnode 递归创建子fiberNode 并进行拼接-------------


function createFiberTreeLoop(childVnodes, parentNode) {
  if (childVnodes.length > 0) {
    parentNode.nodeType = 'HostComponent';

    for (var i = 0; i < childVnodes.length; i++) {
      var childFiberNode = createFiberTree(childVnodes[i], parentNode.sourcePool, parentNode);
      parentNode.children.push(childFiberNode);
    }
  }
} //! -----------------render子函数组件-----------------------


function renderFunctionComponent(fiber) {
  if (typeof fiber.stateNode !== 'function') return;

  var _fiber$stateNode = fiber.stateNode(),
      template = _fiber$stateNode.template,
      data = _fiber$stateNode.data,
      components = _fiber$stateNode.components;

  var childFiberNode = createFiberTree(template, {
    data: data,
    components: components
  }, fiber); //todo 生成子树并链接

  fiber.children = [childFiberNode];
} //! -------------创建html并挂载到fiber节点上--------------------


function createDomElement(fiber) {
  //找到父dom节点 将创建好的dom节点添加进去
  var parentDom = getParentDom(fiber);
  var domElement = document.createElement(fiber.tag);
  handleProps(fiber, domElement);

  if (fiber.text) {
    domElement.innerHTML = fiber.text;
  }

  parentDom.appendChild(domElement);
  fiber.stateNode = domElement;
  return domElement;
} //! 预处理FiberNode  将模板和资源先挂载到节点上-----------------


function preHandleFiberNode(source, resources, workInProgressFiber) {
  //todo 切换当前工作fiber
  global.workInprogressFiberNode = workInProgressFiber; //todo 判断传入的source 转换成vnode

  var vnode = typeof source === 'string' ? tplToVDOM(source) : source; //todo 合并处理vnode和Fiber 挂载resource

  var _vnode$children = vnode.children,
      children = _vnode$children === void 0 ? [] : _vnode$children,
      tag = vnode.tag;
  conbineVnodAndFiber(workInProgressFiber, vnode, resources);
  return {
    children: children,
    tag: tag
  };
} //! 处理函数组件节点


function handleFunctionFiberNode(fiber, ComponentName) {
  fiber.nodeType = 'FunctionComponent'; //todo 从sourcePool中获取子组件

  var fc = fiber.sourcePool.components[ComponentName];

  if (!fc) {
    console.error("\u5B50\u7EC4\u4EF6".concat(ComponentName, "\u672A\u6CE8\u518C"));
  } //! 从资源池中拿取需要的props，给子函数组件绑定需要的props,并挂载子函数组件到fiber上


  handleFunctionComponentProps(fiber, fc);
} //! ----------合并vnode和fiber 处理key 挂载resource-----------


function conbineVnodAndFiber(fiber, vnode, resources) {
  var props = vnode.props,
      tag = vnode.tag,
      text = vnode.text;
  fiber.props = props;
  fiber.tag = tag;
  fiber.text = text;
  fiber.sourcePool = resources; //单独对key进行处理

  if (props.key) {
    var key = props.key[0] - 0;
    fiber.key = key;
  }
} //! ----------找到父dom节点---------------------


function getParentDom(fiber) {
  var parentNode = fiber.parentNode;
  var parentDom = parentNode.stateNode;

  if (!parentNode) {
    return document.getElementById('root');
  }

  while (typeof parentDom === 'function') {
    parentNode = parentNode.parentNode;

    if (!parentNode) {
      return document.getElementById('root');
    }

    parentDom = parentNode.stateNode;
  }

  return parentDom;
} //! ------------从资源池中拿取子组件需要的Props 处理后传递给子组件----------
//! 将props设置为单向数据流   并返回处理好的子组件函数传递出去


function handleFunctionComponentProps(fiber, functionComponent) {
  var needProps = fiber.props;
  var data = fiber.sourcePool.data; //否则对其他组件进行处理

  var nextProps = {};

  for (var key in needProps) {
    var originValue = needProps[key][0];
    var value = void 0; //! 对传入的props进行数据类型解析

    if (data[originValue]) {
      //从需求池中找到了对应的数据
      value = data[originValue];
    } else if (!isNaN(originValue - 0)) {
      //传入数字
      value = originValue - 0;
    } else if (originValue[0] === '"' || originValue[0] === "'") {
      //传入字符串
      value = originValue.slice(1, originValue.length - 1).trim();
    } else {
      // 传入普通字符串
      value = originValue;
    }

    nextProps[key] = value;
  } //todo 使用Objdect.defineoroperty包装props为只读(get set方法)
  //todo 定义一个新对象  添加对应的属性并添加描述器get set 


  var newProps = {};

  var _loop = function _loop(_key) {
    var val = nextProps[_key]; // 设置该属性的初始值

    Object.defineProperty(newProps, _key, {
      get: function get() {
        return val;
      },
      set: function set(newVal) {
        console.warn('您正在尝试修改props, 不推荐此操作, 请保证数据单向流动');
        val = newVal; // 修改时修改属性
      }
    });
  };

  for (var _key in nextProps) {
    _loop(_key);
  } //给函数组件绑定newProps  挂载到fiber上


  var newFc = functionComponent.bind(null, newProps);
  fiber.stateNode = newFc;
  return newFc;
} //! 对标签中的属性进行处理 给dom节点添加标签 (未完成)


function handleProps(curFiber, dom) {
  var props = curFiber.props;

  for (var key in props) {
    var value = props[key];

    switch (key) {
      //todo  处理className (合并所有的类名)
      case 'className':
        var classNameStr = '';

        for (var i = 0; i < value.length; i++) {
          classNameStr += value[i] + ' ';
        }

        dom.setAttribute("class", classNameStr.trim());
        break;
      //todo  处理class (合并所有的类名)

      case 'class':
        var classStr = '';

        for (var _i2 = 0; _i2 < value.length; _i2++) {
          classStr += value[_i2] + ' ';
        }

        dom.setAttribute("class", classStr.trim());
        break;
      //todo  处理点击事件

      case 'onClick':
        //! 从组件的资源池里找对应的事件
        var dataPool = curFiber.sourcePool.data;
        var callback = dataPool[value[0]];
        dom.onclick = callback;
        break;
      //todo  处理其他

      default:
        dom.setAttribute(key, value[0]);
        break;
    }
  }
} //! -------路由适配方法  待修改---------------------


function useRoute(fiber) {
  //todo  如果是Route组件 将container的fiber传递给子组件 (暂时放到全局)
  if (fiber.tag === 'RouteContainer') {// window.$$routeContainerFiber = fiber
  }
} //! ---------------更新fiberTree (在这里生成第二棵fiberTree)-------------------


function updateFiberTree(source, resources, parentNode, workInProgressFiber, currentFiber) {
  // 添加节点逻辑
  if (!currentFiber) {
    var placementFiber = placementFiberTree(source, resources, parentNode);
    return placementFiber;
  } // 如果没有  生成一个alternate链接上去 


  if (!workInProgressFiber) {
    workInProgressFiber = createAlternate(currentFiber);
  } //todo 预处理Fiber  生成vnode 挂载resource


  var _preHandleFiberNode2 = preHandleFiberNode(source, resources, workInProgressFiber),
      children = _preHandleFiberNode2.children,
      tag = _preHandleFiberNode2.tag; //todo 挂载parentNode


  workInProgressFiber.parentNode = parentNode; //TODO -----------如果tag大写 解析为组件 ----------------

  if (tag[0] === tag[0].toUpperCase()) {
    //! 处理为组件节点
    handleFunctionFiberNode(workInProgressFiber, tag); // ! 函数节点执行函数并继续向下更新fiberTree

    updateRenderFunctionComponent(workInProgressFiber, currentFiber);
  } //TODO ----------小写的情况  是domComponent节点/text节点 挂载dom节点--------
  else {
    workInProgressFiber.nodeType = 'HostText';
    workInProgressFiber.stateNode = currentFiber.stateNode;
  } //todo 如果有children 深度优先遍历  


  if (children.length > 0) {
    workInProgressFiber.nodeType = 'HostComponent';
    updateFiberTreeLoop(children, workInProgressFiber, currentFiber);
  } //适配路由


  useRoute(workInProgressFiber);
  return workInProgressFiber;
} //! 根据子vnode 递归更新子fiberNode 并进行拼接-------------


function updateFiberTreeLoop(childVnodes, workInProgressFiber, currentFiber) {
  //删除节点的情况  将workInprogress之前多出的节点删除
  if (workInProgressFiber.children.length > childVnodes.length) {
    var position = childVnodes.length;
    workInProgressFiber.children.splice(position);
  }

  for (var i = 0; i < childVnodes.length; i++) {
    //! 当map添加item时  可能造成vnode和childrenFiber数量不等
    //! 如果发现没有此fiber 就再根据vnode创建一个fiber
    var vnode = childVnodes[i];
    var resources = workInProgressFiber.sourcePool; //todo 这里发现有添加节点的情况创建了 fiberNode          

    var childWkFiber = workInProgressFiber.children[i];
    var childCurFiebr = currentFiber.children[i]; //todo 有则创建子节点 进行拼接 无则直接遍历更新

    if (childWkFiber) {
      updateFiberTree(vnode, resources, workInProgressFiber, childWkFiber, childCurFiebr);
    } else {
      workInProgressFiber.children[i] = updateFiberTree(vnode, resources, workInProgressFiber, childWkFiber, childCurFiebr);
    }
  }
} //! -----------------update子函数组件-----------------------


function updateRenderFunctionComponent(workInProgressFiber, currentFiber) {
  //处理函数组件  执行函数获得新的数据  往下传递 继续向下递归
  if (typeof workInProgressFiber.stateNode !== 'function') return;

  var _workInProgressFiber$ = workInProgressFiber.stateNode(),
      template = _workInProgressFiber$.template,
      _workInProgressFiber$2 = _workInProgressFiber$.data,
      data = _workInProgressFiber$2 === void 0 ? {} : _workInProgressFiber$2,
      _workInProgressFiber$3 = _workInProgressFiber$.components,
      components = _workInProgressFiber$3 === void 0 ? {} : _workInProgressFiber$3; //todo继续让子fiber向下递归更新


  var childWkFiber = workInProgressFiber.children[0];
  var childCurFiebr = currentFiber.children[0];
  var resources = {
    data: data,
    components: components
  }; //todo 如果没有子节点  那么需要在这里链接父子树  或者直接向下遍历更新

  if (!childWkFiber) {
    workInProgressFiber.children = [updateFiberTree(template, resources, workInProgressFiber, childWkFiber, childCurFiebr)];
  } else {
    updateFiberTree(template, resources, workInProgressFiber, childWkFiber, childCurFiebr);
  }
} //! 创建Placement的fiberNode  类似createFiberTree


function placementFiberTree(source, resources, parentNode) {
  //todo 创建一个新的fiber节点(浅拷贝) 更新当前工作节点
  var newFiberNode = new NewFiberNode('mount', parentNode.$fiber); //todo 预处理Fiber  生成vnode 挂载resource

  var _preHandleFiberNode3 = preHandleFiberNode(source, resources, newFiberNode),
      children = _preHandleFiberNode3.children,
      tag = _preHandleFiberNode3.tag; //todo 挂载父节点


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

  var _fiber$stateNode2 = fiber.stateNode(),
      template = _fiber$stateNode2.template,
      _fiber$stateNode2$dat = _fiber$stateNode2.data,
      data = _fiber$stateNode2$dat === void 0 ? {} : _fiber$stateNode2$dat,
      _fiber$stateNode2$com = _fiber$stateNode2.components,
      components = _fiber$stateNode2$com === void 0 ? {} : _fiber$stateNode2$com;

  var childFiberNode = placementFiberTree(template, {
    data: data,
    components: components
  }, fiber); //todo 生成子树并链接

  fiber.children = [childFiberNode];
} //! ---------创建Fiber替代并链接----------


function createAlternate(currentFiber) {
  //todo 新建一个fiberNode
  var workInProgressFiber = new NewFiberNode('update', '$2'); //! 将一些属性复制给workInProgress

  workInProgressFiber.stateQueueTimer = currentFiber.stateQueueTimer;
  workInProgressFiber.updateQueue = currentFiber.updateQueue;
  workInProgressFiber.hookIndex = currentFiber.hookIndex;
  workInProgressFiber.memorizedState = currentFiber.memorizedState;
  workInProgressFiber.nodeType = currentFiber.nodeType; //! 链接两个fiber 

  workInProgressFiber.alternate = currentFiber;
  currentFiber.alternate = workInProgressFiber;
  return workInProgressFiber;
} //! 字符串扫描解析器


var Scanner = /*#__PURE__*/function () {
  function Scanner(text) {
    _classCallCheck(this, Scanner);

    this.text = text; // 指针

    this.pos = 0; // 尾巴  剩余字符

    this.tail = text;
  }
  /**
   * 路过指定内容
   *
   * @memberof Scanner
   */


  _createClass(Scanner, [{
    key: "scan",
    value: function scan(tag) {
      if (this.tail.indexOf(tag) === 0) {
        // 直接跳过指定内容的长度
        this.pos += tag.length; // 更新tail

        this.tail = this.text.substring(this.pos);
      }
    }
    /**
     * 让指针进行扫描，直到遇见指定内容，返回路过的文字
     *
     * @memberof Scanner
     * @return str 收集到的字符串
     */

  }, {
    key: "scanUntil",
    value: function scanUntil(stopTag) {
      // 记录开始扫描时的初始值
      var startPos = this.pos; // 当尾巴的开头不是stopTg的时候，说明还没有扫描到stopTag

      while (!this.eos() && this.tail.indexOf(stopTag) !== 0) {
        // 改变尾巴为当前指针这个字符到最后的所有字符
        this.tail = this.text.substring(++this.pos);
      } // 返回经过的文本数据


      return this.text.substring(startPos, this.pos).trim();
    }
    /**
     * 判断指针是否到达文本末尾（end of string）
     *
     * @memberof Scanner
     */

  }, {
    key: "eos",
    value: function eos() {
      return this.pos >= this.text.length;
    }
  }]);

  return Scanner;
}(); //! 拆分html中的事件  (键值对)


function eventParser(html) {
  var jsEXP = /\w*\={{([\s\S]*?)}*}/;
  var newHtml = html;
  var event = {}; //todo 没有检测到事件直接退出

  if (!jsEXP.test(html)) return {
    newHtml: newHtml,
    event: event
  }; //TODO  循环拆离里面所有的JS语法 转换成键值对  

  var kvArr = [];
  var kv = [];

  while (kv) {
    kv = jsEXP.exec(newHtml);

    if (kv) {
      kvArr.push(kv[0]);
      newHtml = newHtml.replace(kv[0], '');
    }
  } //todo 将键值对数组拆分保存到event对象中


  kvArr.forEach(function (item) {
    //删去最后两个}} 根据={{拆分成key value
    var newItem = item.slice(0, item.length - 2);
    var arr = newItem.split('={{'); //todo 使用eval将函数字符串转化为可执行的函数

    var val = eval("(" + arr[1] + ")");
    event[arr[0]] = val;
  });
  return {
    newHtml: newHtml,
    event: event
  };
} //! 拆分html中的属性  (键值对)


function allPropsParser(html) {
  //todo 正则适配
  // const classEXP = /\w*\="([\s\S]*?)"/
  var classEXP = /[\w-]*="([\s\S]*?)"/; //! 包括横杠类名

  var singleEXP = /\w*\='([\s\S]*?)'/;
  var eventEXP = /\w*\={([\s\S]*?)}/; //todo 将中间多个空格合并为一个

  var newHtml2 = html.replace(/ +/g, ' ');
  var props = {}; //todo 没有检测到事件直接退出

  var hasProps = classEXP.test(html) || singleEXP.test(html) || eventEXP.test(html);
  if (!hasProps) return {
    newHtml2: newHtml2,
    props: props
  }; //TODO  循环拆离里面所有的JS语法 转换成键值对  

  var kvArr = [];
  var kv = [];

  while (kv) {
    kv = classEXP.exec(newHtml2) || singleEXP.exec(newHtml2) || eventEXP.exec(newHtml2);

    if (kv) {
      kvArr.push(kv[0]);
      newHtml2 = newHtml2.replace(kv[0], '');
    }
  } //todo 将键值对数组拆分保存到event对象中


  kvArr.forEach(function (item) {
    var kv = item.split('='); //从等号拆分

    var k = kv[0]; //对key value进行处理

    var v = kv[1].slice(1, kv[1].length - 1).split(' ');
    props[k] = v; //赋值给对象
  });
  return {
    newHtml2: newHtml2,
    props: props
  };
} //! 将html模板字符串转换成tokens数组


function collectTokens(html) {
  var scanner = new Scanner(html);
  var tokens = [];
  var word = '';

  while (!scanner.eos()) {
    // 扫描文本
    var text = scanner.scanUntil('<');
    scanner.scan('<');
    tokens[tokens.length - 1] && tokens[tokens.length - 1].push(text); // 扫描标签<>中的内容

    word = scanner.scanUntil('>');
    scanner.scan('>'); // 如果没有扫描到值，就跳过本次进行下一次扫描

    if (!word) continue; //todo 对本次扫描的字符串进行事件处理

    var _eventParser = eventParser(word),
        newHtml = _eventParser.newHtml,
        event = _eventParser.event; //todo 拆分事件


    word = newHtml;

    var _allPropsParser = allPropsParser(word),
        newHtml2 = _allPropsParser.newHtml2,
        props = _allPropsParser.props; //todo 拆分事件


    word = newHtml2; // 区分开始标签 # 和结束标签 /

    if (word.startsWith('/')) {
      tokens.push(['/', word.slice(1)]);
    } else {
      //todo 如果有属性存在，则解析属性 (且将event添加进去)
      var firstSpaceIdx = word.indexOf(' ');

      if (firstSpaceIdx === -1) {
        tokens.push(['#', word, Object.assign(Object.assign({}, event), props)]);
      } else {
        // 解析属性
        tokens.push(['#', word.slice(0, firstSpaceIdx), Object.assign(Object.assign({}, event), props)]);
      }
    }
  }

  return tokens;
} //! 将tokens数组形成dom树形结构


function nestTokens(tokens) {
  var nestedTokens = [];
  var stack = [];
  var collector = nestedTokens;

  for (var i = 0, len = tokens.length; i < len; i++) {
    var token = tokens[i];

    switch (token[0]) {
      case '#':
        // 收集当前token
        collector.push(token); // 压入栈中

        stack.push(token); // 由于进入了新的嵌套结构，新建一个数组保存嵌套结构
        // 并修改collector的指向

        token.splice(2, 0, []);
        collector = token[2];
        break;

      case '/':
        // 出栈
        stack.pop(); // 将收集器指向上一层作用域中用于存放嵌套结构的数组

        collector = stack.length > 0 ? stack[stack.length - 1][2] : nestedTokens;
        break;

      default:
        collector.push(token);
    }
  }

  return nestedTokens;
} //! 将tokens树转化为虚拟dom树


function tokens2vdom(tokens) {
  var vdom = {};

  for (var i = 0, len = tokens.length; i < len; i++) {
    var token = tokens[i];
    vdom['tag'] = token[1];
    vdom['props'] = token[3];

    if (token[4]) {
      vdom['text'] = token[token.length - 1];
    } else {
      vdom['text'] = undefined;
    }

    var children = token[2];

    if (children.length === 0) {
      vdom['children'] = undefined;
      continue;
    }

    ;
    vdom['children'] = [];

    for (var j = 0; j < children.length; j++) {
      vdom['children'].push(tokens2vdom([children[j]]));
    }

    if (vdom['children'].length === 0) {
      delete vdom['children'];
    }
  }

  return vdom;
} //! 总和方法 转换html模板为虚拟dom


function tplToVDOM(html) {
  var tokensArr = collectTokens(html);
  var tokensTree = nestTokens(tokensArr);
  var vdom = tokens2vdom(tokensTree);
  return vdom;
}
        } ,
 {} 
 ],
}


            //TODO 无尾缀的添加尾缀
            function addSuffix(path){
                var index = path.lastIndexOf(".");
                var ext = path.substr(index + 1);
        
                if (ext.length > 5) {
                    path = path + '.js'
                }
                return path
            }
            //todo 创建require函数 获取modules的函数代码和mapping对象
            function require(absolutePath){
                const [fn,mapping]  = modules[absolutePath]

                //! 构造fn所需的require函数(loaclRequire 通过相对路径获取绝对路径(id)并执行require)
                const loaclRequire =(relativePath)=>{  
                    relativePath = addSuffix(relativePath)                  
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
            
        })();