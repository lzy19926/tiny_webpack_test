"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueryCache = void 0;
const subscribable_1 = require("./subscribable");
const utils_1 = require("./utils");
const Query_1 = require("./Query");
//! QueryCache挂载在QueryClient上   这里储存了多个query数据结构  用于管理多个Query
class QueryCache extends subscribable_1.Subscribable {
    constructor(client, config) {
        super();
        this.config = config || {};
        this.queries = new Set();
        this.queriesMap = {};
        this.queryClient = client;
    }
    getQuery(options) {
        let query = this.findQuery(options);
        return query;
    }
    getQueries() {
        return this.queriesMap;
    }
    createQuery(options, state) {
        const queryHash = (0, utils_1.createQueryHash)(options);
        const newQuery = new Query_1.Query({
            cache: this,
            queryKey: options.queryKey,
            queryHash,
            options,
            state
        });
        this.addQuery(newQuery);
        return newQuery;
    }
    addQuery(query) {
        const hash = query.queryHash;
        if (!this.queriesMap[hash]) {
            this.queriesMap[hash] = query;
            this.queries.add(query);
        }
    }
    removeQuery(query) {
        const hash = query.queryHash;
        if (this.queriesMap[hash] === query) {
            delete this.queriesMap[hash];
            this.queries.delete(query);
        }
        console.log('删除Query', this.queries);
    }
    findQuery(options) {
        const queryHash = (0, utils_1.createQueryHash)(options);
        return this.queriesMap[queryHash];
    }
}
exports.QueryCache = QueryCache;
