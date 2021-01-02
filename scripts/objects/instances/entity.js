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

    process() {
        this.processTicks++;
    }
}
