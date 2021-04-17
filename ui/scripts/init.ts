import { Game } from "../../engine/game";
import { IoBridge } from "../../io-bridge/io-bridge";
import { Ui } from "./ui";

require('../styles/ui.css');
require('../styles/scene.css');

var game = new Game({
    terrain: {
        x: 500,
        y: 400,
    }
}, (callback) => {
    window.requestAnimationFrame(callback);
});
var ui = new Ui(document, '#controls', '#scene', '#details', '#meta');

new IoBridge(game, ui);
