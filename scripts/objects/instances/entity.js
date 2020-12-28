// @ts-check

class Entity extends Instance {
    /**
     *
     * @param {Position} position
     */
    constructor(position) {
        super();
        this.position = position;
        this.processTicks = 0;
    }

    /**
     *
     * @param {Game} game
     */
    process(game) {
        this.processTicks++;
    }
}
