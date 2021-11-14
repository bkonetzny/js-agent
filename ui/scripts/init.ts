import { IoBridge } from "../../io-bridge/io-bridge";
import { Ui } from "./ui";

require('../styles/ui.css');
require('../styles/scene.css');

var ui = new Ui(document, '#controls', '#scene', '#details', '#meta');

new IoBridge(ui, {
    terrain: {
        x: 500,
        y: 400,
    }
}, 'window');
