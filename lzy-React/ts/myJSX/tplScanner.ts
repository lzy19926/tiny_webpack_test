//! 字符串扫描解析器
class Scanner {
    text: any
    pos: any
    tail: any


    constructor(text: any) {
        this.text = text;
        // 指针
        this.pos = 0;
        // 尾巴  剩余字符
        this.tail = text;
    }

    /**
     * 路过指定内容
     *
     * @memberof Scanner
     */
    scan(tag: any) {
        if (this.tail.indexOf(tag) === 0) {
            // 直接跳过指定内容的长度
            this.pos += tag.length;
            // 更新tail
            this.tail = this.text.substring(this.pos);
        }
    }

    /**
     * 让指针进行扫描，直到遇见指定内容，返回路过的文字
     *
     * @memberof Scanner
     * @return str 收集到的字符串
     */
    scanUntil(stopTag: any) {
        // 记录开始扫描时的初始值
        const startPos = this.pos;
        // 当尾巴的开头不是stopTg的时候，说明还没有扫描到stopTag
        while (!this.eos() && this.tail.indexOf(stopTag) !== 0) {
            // 改变尾巴为当前指针这个字符到最后的所有字符
            this.tail = this.text.substring(++this.pos);
        }

        // 返回经过的文本数据
        return this.text.substring(startPos, this.pos).trim();
    }

    /**
     * 判断指针是否到达文本末尾（end of string）
     *
     * @memberof Scanner
     */


    eos() {
        return this.pos >= this.text.length;
    }
}

export default Scanner