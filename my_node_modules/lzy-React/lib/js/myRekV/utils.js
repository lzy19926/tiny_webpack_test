"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isPlainObject = exports.isFunction = void 0;
function isFunction(fn) {
    return typeof fn === 'function';
}
exports.isFunction = isFunction;
// 判断是否是原始对象(未包装过的对象)
function isPlainObject(obj) {
    if (typeof obj !== 'object' || obj === null)
        return false;
    // 找到原型练最里层(Object原型对象)  如果传入对象的原型对象就是Object原型对象 那么就是原始对象
    //原始对象: 未经过包装的对象(比如vue的包装后的对象)
    let proto = obj;
    while (Object.getPrototypeOf(proto) !== null) {
        proto = Object.getPrototypeOf(proto);
    }
    return Object.getPrototypeOf(obj) === proto;
}
exports.isPlainObject = isPlainObject;
