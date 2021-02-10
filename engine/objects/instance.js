// @ts-check

class Instance {
    constructor() {
        this.game = null;
        this.id = Helper.createUuid();
    }

    /**
     *
     * @param {Game} game
     */
    setGame(game) {
        this.game = game;
    }
}
