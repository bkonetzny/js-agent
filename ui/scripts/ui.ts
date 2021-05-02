import { InputCommandInterface } from "../../io-bridge/input-commands";
import { InputHandlerInterface } from "../../io-bridge/handlers";
import { UiControls } from "./ui-controls";
import { UiDetails } from "./ui-details";
import { UiMeta } from "./ui-meta";
import { UiScene } from "./ui-scene";
import { OutputStateInterface } from "../../io-bridge/output-state";
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
    private inputHandler?: InputHandlerInterface;
    private controlsDomElement: HTMLDivElement;
    private sceneDomElement: HTMLDivElement;
    private detailsDomElement: HTMLDivElement;
    private metaDomElement: HTMLDivElement;
    private details: UiDetails;
    private scene: UiScene;
    private controls: UiControls;
    private meta: UiMeta;

    /**
     * Creates an instance of Ui. The entry point of the whole game ui
     */
    constructor(domDocument: Document, controlsSelector: string, sceneSelector: string, detailsSelector: string, metaSelector: string) {
        this.inputHandler = undefined;

        this.controlsDomElement = domDocument.querySelector<HTMLDivElement>(controlsSelector)!;
        this.sceneDomElement = domDocument.querySelector<HTMLDivElement>(sceneSelector)!;
        this.detailsDomElement = domDocument.querySelector<HTMLDivElement>(detailsSelector)!;
        this.metaDomElement = domDocument.querySelector<HTMLDivElement>(metaSelector)!;

        this.details = new UiDetails(this, this.detailsDomElement);
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

    setInputHandler(inputHandler: InputHandlerInterface) {
        this.inputHandler = inputHandler;
    }

    handleInput(inputCommand: InputCommandInterface): any {
        console.log('handleInput', inputCommand);

        const handleInputResult = this.inputHandler?.command(inputCommand);

        console.log('handleInputResult', handleInputResult);

        return handleInputResult;
    }

    updateState(outputState: OutputStateInterface) {
        this.scene.render(outputState.terrain, outputState.locations, outputState.agents, outputState.paths);
        this.meta.render();
        this.controls.render(outputState.running, outputState.settings);

        /*
        console.clear();
        console.log(outputState.locations);
        console.log(outputState.jobs);
        */
    }
}
