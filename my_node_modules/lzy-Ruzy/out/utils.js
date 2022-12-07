"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isPlainObject = void 0;
function isPlainObject(obj) {
    if (typeof obj !== 'object' || obj === null)
        return false;
    let proto = obj;
    while (Object.getPrototypeOf(proto) !== null) {
        proto = Object.getPrototypeOf(proto);
    }
    // proto = null
    return Object.getPrototypeOf(obj) === proto;
}
exports.isPlainObject = isPlainObject;
