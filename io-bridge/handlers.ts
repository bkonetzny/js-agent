import { Game } from "../engine/game";
import { Ui } from "../ui/scripts/ui";
import { InputCommandInterface } from "./input-commands";

class InputHandler {
    private game : Game;

    constructor(game: Game, ui: Ui) {
        this.game = game;
        ui.setInputHandler(this);
    }

    command(inputCommand: InputCommandInterface): any {
        return this.game.command(inputCommand);
    }
}

class OutputHandler {
    private ui : Ui;

    constructor(game: Game, ui: Ui) {
        this.ui = ui;
        game.setOutputHandler(this);
    }

    update(...args) {
        // @ts-ignore
        this.ui.updateState(...args);
    }
}

export {
    InputHandler,
    OutputHandler,
}
