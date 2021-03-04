import { Ui } from "../ui/scripts/ui";
import { Game } from "./game";

export class OutputHandler {
    private ui : Ui;

    constructor(game: Game, ui: Ui) {
        game.setOutputHandler(this);
        this.ui = ui;
    }

    update(...args) {
        // @ts-ignore
        this.ui.updateState(...args);
    }
}
