import { initGame } from "./data/data.js";
import { initGameRender } from "./render/main.js";
import { GlobalEvent } from "./Events/global.js";

const globalState = initGame()
initGameRender(globalState)

GlobalEvent();

export {globalState}