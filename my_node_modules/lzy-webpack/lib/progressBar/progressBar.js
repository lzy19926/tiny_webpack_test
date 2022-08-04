const slog = require('single-line-log').stdout; // 单行打印文本库
const { changeColor } = require('./changeColor')

/*
todo 使用方法
  初始化一个进度条长度为 50 的 ProgressBar 实例
    var pb = new ProgressBar('下载进度', 50);
  更新进度条 更新百分之1
    pb.render({ completed: 1, total: 100 });
*/

// 封装的 ProgressBar 工具
class ProgressBar {
    constructor(description, bar_length) {
        // 两个基本参数(属性)
        this.description = description || 'Progress';    // 命令行开头的文字信息
        this.length = bar_length || 25;           // 进度条的长度(单位：字符)，默认设为 25
    }

    // 刷新进度条图案、文字的方法
    render(opts) {
        var percent = (opts.completed / opts.total).toFixed(4);  // 计算进度(子任务的 完成数 除以 总数)
        var cell_num = Math.floor(percent * this.length);       // 计算需要多少个 █ 符号来拼凑图案

        // 拼接黑色条
        var cell = '';
        for (var i = 0; i < cell_num; i++) {
            cell += '█';
        }

        // 拼接灰色条
        var empty = '';
        for (var i = 0; i < this.length - cell_num; i++) {
            empty += '░';
        }

        // 进度条文本
        var cmdText = changeColor(this.description) + ': ' + (100 * percent).toFixed(2) + '% ' + cell + empty + ' ' + opts.completed + '/' + opts.total;

        // 进度条后文本
        var afterText = opts.text

        // 在单行输出文本
        slog(cmdText + ' ' + afterText + '\n\n');

    };
}

module.exports = ProgressBar;
