// @ts-check

class InputHandler {
    /**
     *
     * @param {Game} game
     * @param {Ui} ui
     */
    constructor(game, ui) {
        this.game = game;
        ui.setInputHandler(this);
    }

    /**
     *
     * @param {String} command
     * @param {Object} data
     * @returns {any}
     */
    command(command, data) {
        return this.game.command(command, data);
    }
}
