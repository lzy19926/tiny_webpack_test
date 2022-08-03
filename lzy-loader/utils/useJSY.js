

//todo 传入模板  将标签内需要使用的属性和方法解析出来  放到data里
function useJSY(template) {

    //todo 收集{( )}标签中JS代码内容 
    //todo 将内部JS代码替换为${...}模板字符串形式
    const textEXP = /({\([\s\S]*?\)})/g

    if (textEXP.test(template)) {
        const textArr = template.match(textEXP)
        textArr.forEach((jsStr) => {
            template = template.replace(jsStr, '${' + jsStr.slice(2, jsStr.length - 2) + '}')
        })
    }



    //todo 获取开始标签内容
    const tagEXP = /(<[\s\S]*?>)/g
    const tagArr = template.match(tagEXP)
    const startTagArr = tagArr.filter((tag) => {
        return tag.startsWith('<') && !tag.startsWith('</')
    })

    //todo 处理大写tag  {}中的内容
    const tokens = []
    const componentsArr = []
    //todo 处理开始标签内容
    startTagArr.forEach((item) => {
        const tagContent = item.slice(1, item.length - 1)
        tokens.push(tagContent)
        //todo 拆离开始标签内Tag(大写组件) 如果是大写tag就推入数组
        const tag = tagContent.split(' ')[0]
        if (tag[0] === tag[0].toUpperCase()) {
            componentsArr.push(tag)
        }
    })


    //todo 对标签中的{}内容进行解析  找到则推入dataStr(以字符串的形式拼接)
    let needDataStr = ''
    const propEXP = /({[\s\S]*?})/g
    tokens.forEach(token => {
        //使用set数组去重
        const propArr = [...new Set(token.match(propEXP))];
        //todo 将所有匹配项拼接起来 删去{ }
        if (propArr) {
            propArr.forEach(prop => {
                const key = prop.replace('{', '').replace('}', '')
                const kvStr = `${key}:${key},`
                needDataStr += kvStr
            })
        }
    })

    //todo 将组件数组转化为键值对
    let needComponentsStr = ''
    //set数组去重
    const newComponentsArr = [...new Set(componentsArr)];

    newComponentsArr.forEach((key) => {
        const kvStr = `${key}:${key},`
        needComponentsStr += kvStr
    })


    //todo  最终获得的needData和components 再包一层{}
    // {name:name, handleClick:handleClick, 1:1,} , {Demo:Demo,Test:Test} 
    const needData = `{${needDataStr}}`
    const needComponents = `{${needComponentsStr}}`

    //todo 将转换完的options对象返回
    const options = `{
        components:${needComponents},
        data: ${needData},
        template:${template},
    }`


    return options
}



module.exports = useJSY

//!------ 转换<TEMPLATE/>模板为options对象:---------
// const options = `{
//     components:{ Demo },
//     data: ${needData},
//     template:'<div><Demo id={1}></Demo></div>',
// }`;