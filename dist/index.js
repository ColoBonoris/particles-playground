"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveTheWorld = void 0;
let isWorldSaved = false;
function saveTheWorld() {
    if (isWorldSaved) {
        return `Too late, world has already been saved`;
    }
    else {
        isWorldSaved = true;
        return `Hurray, you just saved the world`;
    }
}
exports.saveTheWorld = saveTheWorld;
