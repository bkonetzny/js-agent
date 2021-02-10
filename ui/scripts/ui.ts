// @ts-check

import { Game } from "../../engine/game";
import { InputHandler } from "../../engine/input-handler";
import { OutputHandler } from "../../engine/output-handler";
import { UiControls } from "./ui-controls";
import { UiDetails } from "./ui-details";
import { UiScene } from "./ui-scene";

export class Ui {
    // We will type those as any for now, just to be able to start from here with typescript
    // TODO: implement interfaces
    private inputHandler: any;
    private controlsSelector: any;
    private sceneSelector : any;
    private detailsSelector: any;
    private controlsDomElement: any;
    private detailsDomElement: any;
    private details: any;
    private scene: any;
    private controls: any;

    /**
     *
     * @param {Document} domDocument
     * @param {String} controlsSelector
     * @param {String} sceneSelector
     * @param {String} detailsSelector
     */
    constructor(domDocument, controlsSelector, sceneSelector, detailsSelector) {
        this.inputHandler = null;

        this.controlsSelector = controlsSelector;
        this.sceneSelector = sceneSelector;
        this.detailsSelector = detailsSelector;

        this.controlsDomElement = domDocument.querySelector(this.controlsSelector);
        this.sceneSelector = domDocument.querySelector(this.sceneSelector);
        this.detailsDomElement = domDocument.querySelector(this.detailsSelector);

        this.details = new UiDetails(this.detailsDomElement);
        this.scene = new UiScene(this, this.sceneSelector, domDocument, this.details);
        this.controls = new UiControls(this, this.controlsDomElement, this.scene);
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
        return this.inputHandler.command(command, data);
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
