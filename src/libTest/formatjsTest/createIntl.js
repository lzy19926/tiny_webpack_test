import { createIntl } from "lzy-formatjs"

const messages_en = {
    hellow: "hellow,{name}!",
    fxxk: "fxxk you,{name}!",
}
const messages_zh = {
    hellow: "你好,{name}",
    fxxk: "法克鱿,{name}!",
}
// 创建配置
const config_en = {
    locale: 'en',
    messages: messages_en,
}
const config_zh = {
    locale: 'zh',
    messages: messages_zh,
}

// 创建Intl实例对象
const Intl_EN = createIntl(config_en)
const Intl_ZH = createIntl(config_zh)

// -------------国际化自定义文本(message国际化)-----------------------
const msg1 = Intl_EN.formatMessage({ id: "hellow" }, { name: "zhangsan" }) // 'hellow,zhangsan!'
const msg2 = Intl_EN.formatMessage({ id: "fxxk" }, { name: "zhangsan" })// 'fxxk you,zhangsan!'

const msg3 = Intl_ZH.formatMessage({ id: "hellow" }, { name: "张三" })// '你好,张三'
const msg4 = Intl_ZH.formatMessage({ id: "fxxk" }, { name: "张三" })// '法克鱿,张三!'

// -------------------国际化Date-------------------
const dateOption = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
}
// @ts-ignore
const msg5 = Intl_EN.formatDate(new Date(), dateOption) // 'Monday, May 8, 2023'
// @ts-ignore
const msg6 = Intl_ZH.formatDate(new Date(), dateOption) // 2023年5月8日星期一

// -------------------国际化货币-------------------
const msg7 = Intl_EN.formatNumber(1000, { // $1,000.00
    style: 'currency',
    currency: 'USD'
})
const msg8 = Intl_ZH.formatNumber(1000, { // ¥1,000.00
    style: 'currency',
    currency: 'CNY'
})

// -------------------国际化时间-------------------
const timeOption = {
    second: 'numeric',
    minute: 'numeric',
    hour: 'numeric',
    day: 'numeric',
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
}
// @ts-ignore
const msg9 = Intl_EN.formatTime(new Date(), timeOption) // 8, 10:38:07 AM
// @ts-ignore
const msg10 = Intl_ZH.formatTime(new Date(), timeOption)// 8日 10:38:07


console.log(msg1);  // 'hellow,zhangsan!'
console.log(msg2);  // 'fxxk you,zhangsan!'
console.log(msg3);  // '你好,张三'
console.log(msg4);  // '法克鱿,张三!'
console.log(msg5);  // 'Monday, May 8, 2023'
console.log(msg6);  // '2023年5月8日星期一'
console.log(msg7);  // '$1,000.00'
console.log(msg8);  // '¥1,000.00'
console.log(msg9);  // '8, 1:44:54 PM'
console.log(msg10); // '8日 13:44:54'

