"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const StateCache_1 = require("./StateCache");
// 暴露给用户调用的类
class Ruzy {
    constructor(initState) {
        this.store = new StateCache_1.StateCache(initState);
    }
    useState(...key) {
        var _a;
        if (!this.store)
            return console.error('store未初始化');
        return (_a = this.store) === null || _a === void 0 ? void 0 : _a.useBaseState(...key);
    }
    setState(param) {
        var _a;
        if (!this.store)
            return console.error('store未初始化');
        return (_a = this.store) === null || _a === void 0 ? void 0 : _a.setBaseState(param);
    }
    getState(key) {
        var _a;
        if (!this.store)
            return console.error('store未初始化');
        return (_a = this.store) === null || _a === void 0 ? void 0 : _a.getState(key);
    }
    getAllState() {
        var _a;
        if (!this.store)
            return console.error('store未初始化');
        return (_a = this.store) === null || _a === void 0 ? void 0 : _a.getAllState();
    }
}
exports.default = Ruzy;
