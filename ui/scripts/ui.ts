import { AgentEntity } from "../../engine/objects/instances/entities/agent-entity";
import { LocationEntity } from "../../engine/objects/instances/entities/location-entity";
import { Job } from "../../engine/objects/instances/job";
import { Order } from "../../engine/objects/instances/order";
import { Resource } from "../../engine/objects/instances/resource";
import { InputCommandInterface } from "../../io-bridge/input-commands";
import { InputHandler } from "../../io-bridge/handlers";
import { UiControls } from "./ui-controls";
import { UiDetails } from "./ui-details";
import { UiMeta } from "./ui-meta";
import { UiScene } from "./ui-scene";
/* import * as Phaser from "phaser";
import { GameLevel } from "../scenes/Level"; */

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
    private inputHandler?: InputHandler;
    private controlsDomElement: HTMLElement;
    private sceneDomElement: HTMLElement;
    private detailsDomElement: HTMLElement;
    private metaDomElement: HTMLElement;
    private details: UiDetails;
    private scene: UiScene;
    private controls: UiControls;
    private meta: UiMeta;

    /**
     * Creates an instance of Ui. The entry point of the whole game ui
     */
    constructor(domDocument: Document, controlsSelector: string, sceneSelector: string, detailsSelector: string, metaSelector: string) {
        this.inputHandler = undefined;

        this.controlsDomElement = domDocument.querySelector<HTMLElement>(controlsSelector)!;
        this.sceneDomElement = domDocument.querySelector<HTMLElement>(sceneSelector)!;
        this.detailsDomElement = domDocument.querySelector<HTMLElement>(detailsSelector)!;
        this.metaDomElement = domDocument.querySelector<HTMLElement>(metaSelector)!;

        this.details = new UiDetails(this.detailsDomElement);
        this.scene = new UiScene(this, this.sceneDomElement, domDocument, this.details);
        this.controls = new UiControls(this, domDocument, this.controlsDomElement, this.scene);
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

    handleInput(inputCommand: InputCommandInterface): any {
        return this.inputHandler?.command(inputCommand);
    }

    updateState(
        running: boolean,
        settings: Object,
        locations: LocationEntity[],
        agents: AgentEntity[],
        jobs: Job[],
        resources: Resource[],
        orders: Order[]
    ) {
        /*
        console.clear();
        console.table(locations);
        console.table(agents);
        console.table(jobs);
        console.table(resources);
        */

        this.scene.render(locations, agents);
        this.meta.render();
        this.controls.render(running, settings);
    }
}
