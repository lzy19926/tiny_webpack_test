export declare class DirectoryWatcher {
    constructor(path: string, options?: Options);
    watch(callback: WatchCallback): void;
}

interface Options {
    interval?: number;
    ignoreInitial?: boolean;
}

type WatchCallback = (eventType: EventType, filename: string) => void;

type EventType = 'add' | 'remove' | 'change';