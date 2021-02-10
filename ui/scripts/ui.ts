// @ts-check

import { Game } from "../../engine/game";
import { UiControls } from "./ui-controls";
import { UiDetails } from "./ui-details";
import { UiScene } from "./ui-scene";

class Ui {
    // We will type those as any for now, just to be able to start from here with typescript
    // TODO: implement interfaces
    private game: any;
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
     * @param {Game} game
     * @param {Document} domDocument
     * @param {String} controlsSelector
     * @param {String} sceneSelector
     * @param {String} detailsSelector
     */
    constructor(game, domDocument, controlsSelector, sceneSelector, detailsSelector) {
        this.game = game;
        this.controlsSelector = controlsSelector;
        this.sceneSelector = sceneSelector;
        this.detailsSelector = detailsSelector;

        this.controlsDomElement = domDocument.querySelector(this.controlsSelector);
        this.sceneSelector = domDocument.querySelector(this.sceneSelector);
        this.detailsDomElement = domDocument.querySelector(this.detailsSelector);

        this.details = new UiDetails(this.detailsDomElement);
        this.scene = new UiScene(this.sceneSelector, domDocument, this.game, this.details);
        this.controls = new UiControls(this.controlsDomElement, this.game, this.scene);

        this.game.setUi(this);
    }

    /**
     *
     * @param {LocationEntity[]} locations
     * @param {AgentEntity[]} agents
     * @param {Job[]} jobs
     * @param {Resource[]} resources
     */
    publish(locations, agents, jobs, resources) {
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
var ui = new Ui(game, document, '#controls', '#scene', '#details');