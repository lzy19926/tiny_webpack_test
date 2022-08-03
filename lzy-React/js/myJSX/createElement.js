function createElement(type, config, children) {
    // 定义ref 和key
    let ref, key;
    if (config) {
        ref = config === null || config === void 0 ? void 0 : config.ref; // 判断props中是否有ref  有则赋值
        key = config === null || config === void 0 ? void 0 : config.key;
        // 删除属性
        config === null || config === void 0 ? true : delete config.ref;
        config === null || config === void 0 ? true : delete config.key;
    }
    //定义props
    const props = {};
    //生成children (children参数后面可能有多个同级的children 需要遍历执行)
    if (arguments.length > 3) {
    }
    else {
        props.children = children;
    }
    //返回生成的虚拟dom
    return {
        $$typeof: Symbol.for('lzyElement'),
        type,
        ref,
        key,
        props
    };
}
