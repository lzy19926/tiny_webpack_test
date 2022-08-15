"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function listenHashChange() {
    window.onhashchange = (e) => {
        console.log('老hash', e.oldURL);
        console.log('新hash', e.newURL);
        console.log('hash', location.hash);
    };
}
function RouteContainer({ fiber }) {
    listenHashChange();
    return {
        template: `<div id='routeContainer'></div>`
    };
}
exports.default = RouteContainer;
