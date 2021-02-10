// @ts-check

class OutputHandler {
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
        this.ui.updateState(...args);
    }
}
