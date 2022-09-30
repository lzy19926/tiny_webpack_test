"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBinadyElementTree = exports.transformElementTreeToBinadyTree = exports.createElement = void 0;
// 判断是否为Element
function isElement(node) {
    if (!node.$$typeof)
        return false;
    return Symbol.keyFor(node.$$typeof) === 'lzyElement';
}
// 给节点添加child和sibling,parent三个属性 放到connect属性里作为二叉树链接
function addPropsToElement(elementNode, parentNode) {
    Object.assign(elementNode, {
        _child: undefined,
        _sibling: undefined,
        _parent: parentNode
    });
}
// 通过解析来的JSX创建Element树
function createElement(...args) {
    let key;
    let ref;
    let children = [];
    const tag = args[0];
    const config = args[1];
    const childNodes = args.slice(2);
    // 处理tag为函数组件的情况(创建组件Element  执行函数并返回ElementNode)
    if (typeof tag === 'function') {
        let fc = tag;
        return {
            $$typeof: Symbol.for('lzyElement'),
            tag: fc.name,
            ref: fc,
            key,
            props: config,
            children: [],
            fiber: undefined
        };
    }
    // 单独处理ref和key
    if (config) {
        ref = config.ref;
        key = config.key;
        // 删除属性
        config === null || config === void 0 ? true : delete config.ref;
        config === null || config === void 0 ? true : delete config.key;
    }
    // 遍历处理childrenNode
    if (childNodes.length > 0) {
        childNodes.forEach((child) => {
            if (isElement(child)) {
                children.push(child);
            }
            else {
                children.push({
                    $$typeof: Symbol.for('lzyElement'),
                    tag: 'text',
                    text: child,
                    fiber: undefined
                });
            }
        });
    }
    //返回生成的虚拟dom
    return {
        $$typeof: Symbol.for('lzyElement'),
        tag,
        ref,
        key,
        props: config,
        children,
        fiber: undefined
    };
}
exports.createElement = createElement;
//! 将ElementTree森林结构递归转为二叉Element树
function transformElementTreeToBinadyTree(elementTree, parentElement) {
    const rootElementNode = elementTree;
    const children = rootElementNode.children;
    addPropsToElement(rootElementNode, parentElement);
    children.forEach((child, index) => {
        addPropsToElement(child, rootElementNode);
        if (index === 0) {
            rootElementNode._child = child;
            delete rootElementNode.children;
        }
        else {
            children[index - 1]._sibling = child;
            delete children[index - 1].children;
        }
        if (child.children) {
            transformElementTreeToBinadyTree(child, rootElementNode);
        }
    });
    return rootElementNode;
}
exports.transformElementTreeToBinadyTree = transformElementTreeToBinadyTree;
//! 综合方法
function createBinadyElementTree(functionComponent, parentElement) {
    const elementTree = createElement(functionComponent);
    const binadyElementTree = transformElementTreeToBinadyTree(elementTree, parentElement);
    return binadyElementTree;
}
exports.createBinadyElementTree = createBinadyElementTree;
// 测试函数
const test = () => {
    function App() {
        return /*#__PURE__*/ createElement("div", null, "123", 
        /*#__PURE__*/ createElement("div", {
            id: 1
        }, "1"), /*#__PURE__*/ createElement("div", {
            id: 1
        }, "1"));
    }
    const res = App();
    console.log(res);
};
