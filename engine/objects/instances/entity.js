// @ts-check

import { Instance } from "../instance";
import { Position } from "../position";

export class Entity extends Instance {
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

    resetProcessTicks() {
        this.processTicks = 0;
    }
}
