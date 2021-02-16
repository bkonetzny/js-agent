// @ts-check

import { Game } from "../../engine/game";
import { InputHandler } from "../../engine/input-handler";
import { OutputHandler } from "../../engine/output-handler";
import { UiControls } from "./ui-controls";
import { UiDetails } from "./ui-details";
import { UiScene } from "./ui-scene";
import * as Phaser from "phaser";
import { GameLevel } from "../scenes/Level";

const stylesUi = require('../styles/ui.css');
const stylesScene = require('../styles/scene.css');

class Boot extends Phaser.Scene {

	preload() {
		
		this.load.pack("pack", "assets/asset-pack.json");
	}

	create() {
		
        this.scene.start("Level");
	}

}
export class Ui {
    // We will type those as any for now, just to be able to start from here with typescript
    // TODO: implement interfaces
    private inputHandler?: InputHandler;
    private controlsSelector: any;
    private sceneSelector : HTMLElement | null;
    private detailsSelector: any;
    private controlsDomElement: any;
    private detailsDomElement: any;
    private details: any;
    private scene: any;
    private controls: any;

    
    /**
     * Creates an instance of Ui. The entry point of the whole game ui
     * @param {Document} domDocument
     * @param {String} controlsSelector
     * @param {*} sceneSelector
     * @param {*} detailsSelector
     * @memberof Ui
     */
    constructor(domDocument: Document, controlsSelector: String, sceneSelector: any, detailsSelector: any) {
        this.inputHandler = undefined;

        this.controlsSelector = controlsSelector;
        this.sceneSelector = domDocument.querySelector<HTMLElement>(sceneSelector);
        this.detailsSelector = detailsSelector;

        this.controlsDomElement = domDocument.querySelector(this.controlsSelector);
        this.detailsDomElement = domDocument.querySelector(this.detailsSelector);

        this.details = new UiDetails(this.detailsDomElement);
        // sceneSelector might be undefined, this we will enforce it for now
        // TODO: Needs to be reworked - prone to fail at any time.
        this.scene = new UiScene(this, this.sceneSelector!, domDocument, this.details);
        this.controls = new UiControls(this, this.controlsDomElement, this.scene);

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
    }

    /**
     *
     * @param {InputHandler} inputHandler
     */
    setInputHandler(inputHandler) {
        this.inputHandler = inputHandler;
    }

    /**
     *
     * @param {String} command
     * @param {Object} data
     * @returns {any}
     */
    handleInput(command, data) {
        return this.inputHandler?.command(command, data);
    }

    /**
     *
     * @param {LocationEntity[]} locations
     * @param {AgentEntity[]} agents
     * @param {Job[]} jobs
     * @param {Resource[]} resources
     */
    updateState(locations, agents, jobs, resources) {
        /*
        console.clear();
        console.table(locations);
        console.table(agents);
        console.table(jobs);
        console.table(resources);
        */

        this.scene.render(locations, agents);
    }
}

var game = new Game();
var ui = new Ui(document, '#controls', '#scene', '#details');

new InputHandler(game, ui);
new OutputHandler(game, ui);

