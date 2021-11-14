import { Game } from "../engine/game";
import { Ui } from "../ui/scripts/ui";
import { InputCommandInterface } from "./input-commands";
import { OutputStateInterface } from "./output-state";

interface InputHandlerInterface {
    command(inputCommand: InputCommandInterface): any
}

interface OutputHandlerInterface {
    update(outputState: OutputStateInterface)
}

class WindowInputHandler implements InputHandlerInterface {
    private game : Game;

    constructor(game: Game, ui: Ui) {
        this.game = game;
        ui.setInputHandler(this);
    }

    command(inputCommand: InputCommandInterface): any {
        return this.game.command(inputCommand);
    }
}

class WindowOutputHandler implements OutputHandlerInterface {
    private ui : Ui;

    constructor(game: Game, ui: Ui) {
        this.ui = ui;
        game.setOutputHandler(this);
    }

    update(outputState: OutputStateInterface) {
        this.ui.updateState(outputState);
    }
}

export {
    InputHandlerInterface,
    OutputHandlerInterface,
    WindowInputHandler,
    WindowOutputHandler,
}
