import { Ui } from "../ui/scripts/ui";
import { Game } from "./game";

export class OutputHandler {
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
