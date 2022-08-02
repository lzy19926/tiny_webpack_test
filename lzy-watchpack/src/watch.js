let Watchpack = require("watchpack");
let path = require('path')

const absPath = path.join(__dirname, './testFile')

var wp = new Watchpack({
    aggregateTimeout: 15000,

    poll: 10000,

    followSymlinks: true,

});

wp.watch({
    // files: listOfFiles,
    directories: [absPath],
    startTime: Date.now() - 10000
});


wp.on("change", function (filePath, mtime, explanation) {
    console.log('change');
});

wp.on("remove", function (filePath, explanation) {

});

wp.on("aggregated", function (changes, removals) {

});

// wp.pause();

// wp.close();

// const { changes, removals } = wp.getAggregated();

// wp.collectTimeInfoEntries(fileInfoEntries, directoryInfoEntries);

// var fileTimes = wp.getTimeInfoEntries();



