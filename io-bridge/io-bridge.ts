import { Ui } from "../ui/scripts/ui";
import { Game, GameSettings } from "../engine/game";
import { WindowInputHandler, WindowOutputHandler } from "./handlers";

export class IoBridge {
    constructor(ui: Ui, gameSettings: GameSettings, mode: string = 'window') {
        if (mode === 'window') {
            const game = new Game(gameSettings, (callback) => {
                window.requestAnimationFrame(callback);
            });

            new WindowInputHandler(game, ui);
            new WindowOutputHandler(game, ui);
        }
        else if (mode === 'worker') {
            // const worker = new Worker('engine.js');
            throw new Error('Mode "worker" not implemented yet');
        }
        else {
            throw new Error('Invalid mode');
        }
    }
}
