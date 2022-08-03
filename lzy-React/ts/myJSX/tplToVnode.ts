
import Scanner from "./tplScanner"

//! 拆分html中的事件  (键值对)
function eventParser(html: string) {


    const jsEXP = /\w*\={{([\s\S]*?)}*}/
    let newHtml = html
    const event: any = {}

    //todo 没有检测到事件直接退出
    if (!jsEXP.test(html)) return { newHtml, event }

    //TODO  循环拆离里面所有的JS语法 转换成键值对  
    const kvArr = []
    let kv: any = []
    while (kv) {
        kv = jsEXP.exec(newHtml)
        if (kv) {
            kvArr.push(kv[0])
            newHtml = newHtml.replace(kv[0], '')
        }
    }
    //todo 将键值对数组拆分保存到event对象中
    kvArr.forEach((item) => {
        //删去最后两个}} 根据={{拆分成key value
        let newItem = item.slice(0, item.length - 2)
        const arr = newItem.split('={{')
        //todo 使用eval将函数字符串转化为可执行的函数
        let val = eval("(" + arr[1] + ")");
        event[arr[0]] = val
    })
    return { newHtml, event }
}

//! 拆分html中的属性  (键值对)
function allPropsParser(html: string) {
    //todo 正则适配
    // const classEXP = /\w*\="([\s\S]*?)"/
    const classEXP = /[\w-]*="([\s\S]*?)"/  //! 包括横杠类名
    const singleEXP = /\w*\='([\s\S]*?)'/
    const eventEXP = /\w*\={([\s\S]*?)}/

    //todo 将中间多个空格合并为一个
    let newHtml2 = html.replace(/ +/g, ' ');

    const props = {}

    //todo 没有检测到事件直接退出
    const hasProps = classEXP.test(html) || singleEXP.test(html) || eventEXP.test(html)
    if (!hasProps) return { newHtml2, props }

    //TODO  循环拆离里面所有的JS语法 转换成键值对  
    const kvArr = []
    let kv = []
    while (kv) {
        kv = classEXP.exec(newHtml2) ||
            singleEXP.exec(newHtml2) ||
            eventEXP.exec(newHtml2)
        if (kv) {
            kvArr.push(kv[0])
            newHtml2 = newHtml2.replace(kv[0], '')
        }
    }

    //todo 将键值对数组拆分保存到event对象中
    kvArr.forEach((item) => {
        let kv = item.split('=')//从等号拆分
        const k = kv[0]//对key value进行处理
        const v = kv[1].slice(1, kv[1].length - 1).split(' ')
        props[k] = v//赋值给对象
    })

    return { newHtml2, props }
}

//! 将html模板字符串转换成tokens数组
function collectTokens(html: string) {


    const scanner = new Scanner(html);
    const tokens = [];

    let word = '';

    while (!scanner.eos()) {
        // 扫描文本
        const text = scanner.scanUntil('<');
        scanner.scan('<');
        tokens[tokens.length - 1] && tokens[tokens.length - 1].push(text);
        // 扫描标签<>中的内容
        word = scanner.scanUntil('>');
        scanner.scan('>');



        // 如果没有扫描到值，就跳过本次进行下一次扫描
        if (!word) continue;

        //todo 对本次扫描的字符串进行事件处理
        const { newHtml, event } = eventParser(word)//todo 拆分事件
        word = newHtml
        const { newHtml2, props } = allPropsParser(word)//todo 拆分事件
        word = newHtml2


        // 区分开始标签 # 和结束标签 /
        if (word.startsWith('/')) {
            tokens.push(['/', word.slice(1)]);
        } else {
            //todo 如果有属性存在，则解析属性 (且将event添加进去)
            const firstSpaceIdx = word.indexOf(' ');
            if (firstSpaceIdx === -1) {
                tokens.push(['#', word, { ...event, ...props },]);
            } else {
                // 解析属性
                tokens.push(['#', word.slice(0, firstSpaceIdx), { ...event, ...props }]);
            }
        }
    }


    return tokens;
}

//! 将tokens数组形成dom树形结构
function nestTokens(tokens: any) {
    const nestedTokens: any[] = [];
    const stack = [];
    let collector = nestedTokens;

    for (let i = 0, len = tokens.length; i < len; i++) {
        const token = tokens[i];

        switch (token[0]) {
            case '#':
                // 收集当前token
                collector.push(token);
                // 压入栈中
                stack.push(token);
                // 由于进入了新的嵌套结构，新建一个数组保存嵌套结构
                // 并修改collector的指向
                token.splice(2, 0, []);
                collector = token[2];
                break;
            case '/':
                // 出栈
                stack.pop();
                // 将收集器指向上一层作用域中用于存放嵌套结构的数组
                collector = stack.length > 0
                    ? stack[stack.length - 1][2]
                    : nestedTokens;
                break;
            default:
                collector.push(token);
        }
    }


    return nestedTokens;
}

//! 将tokens树转化为虚拟dom树
function tokens2vdom(tokens: any) {

    const vdom: any = {};

    for (let i = 0, len = tokens.length; i < len; i++) {
        const token = tokens[i];
        vdom['tag'] = token[1];
        vdom['props'] = token[3];


        if (token[4]) {
            vdom['text'] = token[token.length - 1];
        } else {
            vdom['text'] = undefined;
        }

        const children = token[2];
        if (children.length === 0) {
            vdom['children'] = undefined;
            continue;
        };

        vdom['children'] = [];

        for (let j = 0; j < children.length; j++) {
            vdom['children'].push(tokens2vdom([children[j]]));
        }

        if (vdom['children'].length === 0) {
            delete vdom['children'];
        }
    }

    return vdom;
}


//! 总和方法 转换html模板为虚拟dom
function tplToVDOM(html: string) {

    const tokensArr = collectTokens(html)
    const tokensTree = nestTokens(tokensArr)
    const vdom = tokens2vdom(tokensTree);

    return vdom;
}


export { tplToVDOM, collectTokens, nestTokens, tokens2vdom }

