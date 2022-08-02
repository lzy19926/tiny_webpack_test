const EventEmitter = require("events").EventEmitter;
const fs = require("fs");
const path = require("path");


class WatchpackFileWatcher {
    constructor(watchpack, watcher, files) {
        this.files = Array.isArray(files) ? files : [files];
        this.watcher = watcher;

        
        watcher.on("change", (mtime, type) => {
            for (const file of this.files) {
                watchpack._onChange(file, mtime, file, type);
            }
        });
        watcher.on("remove", type => {
            for (const file of this.files) {
                watchpack._onRemove(file, file, type);
            }
        });
    }


    