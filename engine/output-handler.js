// @ts-check

import { Ui } from "../ui/scripts/ui";
import { Game } from "./game";

export class OutputHandler {
    /**
     *
     * @param {Game} game
     * @param {Ui} ui
     */
    constructor(game, ui) {
        game.setOutputHandler(this);
        this.ui = ui;
    }

    update(...args) {
        // @ts-ignore
        this.ui.updateState(...args);
    }
}
