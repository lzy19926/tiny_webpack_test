(function () {
    console.warn("热更新准备就绪,正在监听文件")
    var bundleHash = ''
    var ws = new WebSocket("ws://localhost:3001/");
    ws.onmessage = function ({ data }) {
        if (bundleHash && bundleHash !== data) return location.reload()
        bundleHash = data
    }
})()