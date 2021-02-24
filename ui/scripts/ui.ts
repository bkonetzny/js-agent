import { Game } from "../../engine/game";
import { InputHandler } from "../../engine/input-handler";
import { OutputHandler } from "../../engine/output-handler";
import { UiControls } from "./ui-controls";
import { UiDetails } from "./ui-details";
import { UiScene } from "./ui-scene";
import { UiMeta } from "./ui-meta";
import { LocationEntity } from "../../engine/objects/instances/entities/location-entity";
import { AgentEntity } from "../../engine/objects/instances/entities/agent-entity";
import { Job } from "../../engine/objects/instances/job";
import { Resource } from "../../engine/objects/instances/resource";
/* import * as Phaser from "phaser";
import { GameLevel } from "../scenes/Level"; */

const stylesUi = require('../styles/ui.css');
const stylesScene = require('../styles/scene.css');

/*
class Boot extends Phaser.Scene {

    preload() {
        this.load.pack("pack", "assets/asset-pack.json");
    }

    create() {
        this.scene.start("Level");
    }

}
*/

export class Ui {
    // We will type those as any for now, just to be able to start from here with typescript
    // TODO: implement interfaces
    private inputHandler ?: InputHandler;
    private controlsSelector: any;
    private sceneSelector : HTMLElement | null;
    private detailsSelector: any;
    private metaSelector: any;
    private controlsDomElement: any;
    private detailsDomElement: any;
    private metaDomElement: any;
    private details: any;
    private scene: any;
    private controls: any;
    private meta: any;

    /**
     * Creates an instance of Ui. The entry point of the whole game ui
     * @memberof Ui
     */
    constructor(domDocument: Document, controlsSelector: string, sceneSelector: any, detailsSelector: any, metaSelector: any) {
        this.inputHandler = undefined;

        this.controlsSelector = controlsSelector;
        this.sceneSelector = domDocument.querySelector<HTMLElement>(sceneSelector);
        this.detailsSelector = detailsSelector;
        this.metaSelector = metaSelector;

        this.controlsDomElement = domDocument.querySelector(this.controlsSelector);
        this.detailsDomElement = domDocument.querySelector(this.detailsSelector);
        this.metaDomElement = domDocument.querySelector(this.metaSelector);

        this.details = new UiDetails(this.detailsDomElement);
        // sceneSelector might be undefined, this we will enforce it for now
        // TODO: Needs to be reworked - prone to fail at any time.
        this.scene = new UiScene(this, this.sceneSelector!, domDocument, this.details);
        this.controls = new UiControls(this, this.controlsDomElement, this.scene);
        this.meta = new UiMeta(this, this.metaDomElement);

        /*
        const game = new Phaser.Game({
            width: 800,
            height: 600,
            type: Phaser.AUTO,
            backgroundColor: "#242424",
            scale: {
                mode: Phaser.Scale.FIT,
                autoCenter: Phaser.Scale.CENTER_BOTH
            }
        });
        game.scene.add("Level", GameLevel);
        game.scene.add("Boot", Boot, true);
        */
    }

    setInputHandler(inputHandler: InputHandler) {
        this.inputHandler = inputHandler;
    }

    handleInput(command: string, data: object): any {
        return this.inputHandler?.command(command, data);
    }

    updateState(locations: LocationEntity[], agents: AgentEntity[], jobs: Job[], resources: Resource[]) {
        /*
        console.clear();
        console.table(locations);
        console.table(agents);
        console.table(jobs);
        console.table(resources);
        */

        this.scene.render(locations, agents);
        this.meta.render();
    }
}

var game = new Game({}, (callback) => {
    window.requestAnimationFrame(callback);
});
var ui = new Ui(document, '#controls', '#scene', '#details', '#meta');

new InputHandler(game, ui);
new OutputHandler(game, ui);
