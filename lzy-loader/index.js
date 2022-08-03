const useJSY = require('./utils/useJSY')

function lzyLoader(source) {
    // console.log('获得的资源', source);
    // console.log('获得的资源', source.visitor.JSXElement);


    //todo 匹配获取<LZY-TEMPLATE></LZY-TEMPLATE>中的内容
    const templateEXP = /<LZY-TEMPLATE[^>]*>(?:.|[\r\n])*?<\/LZY-TEMPLATE>/g
    const templateArr = source.match(templateEXP)
    //todo 将<TEMPLATE>标签替换为<div> 
    const newOptionsArr = templateArr.map((tpl) => {
        const newTpl = tpl
            .replace('<LZY-TEMPLATE>', '`<div>')
            .replace('</LZY-TEMPLATE>', '</div>`')
        //todo 转换内部的模板为options对象
        return useJSY(newTpl)
    })





    //todo 将所有的template标签字符替换成options对象
    //todo 一个标签内字符对应一个options对象i
    for (let i = 0; i < templateArr.length; i++) {
        source = source.replace(templateArr[i], newOptionsArr[i])
    }

    //todo 将新的js字符串返回  交给babel转换为js代码
    return `${source}`
}





module.exports = lzyLoader



