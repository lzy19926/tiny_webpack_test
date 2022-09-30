

export function deepCloneObj(obj) {
    let target = null
    if (typeof obj === 'object') {
        if (Array.isArray(obj)) { //数组
            target = [];
            obj.forEach(item => {
                target.push(deepCloneObj(item));
            })
        } else if (obj) {
            target = {}
            let objKeys = Object.keys(obj);
            objKeys.forEach(key => {
                target[key] = deepCloneObj(obj[key]);
            })
        } else {
            target = obj
        }
    } else {
        target = obj;
    }
    return target
}

