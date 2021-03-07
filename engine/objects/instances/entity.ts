import { Instance } from "../instance";
import { Position } from "../position";

export abstract class Entity extends Instance {
    public position : Position;
    public processTicks : number;

    constructor(position: Position) {
        super();
        this.position = position;
        this.processTicks = 0;
    }

    toJSON() {
        return {
            ...super.toJSON(),
            ...{
                position: this.position,
            }
        };
    }

    process() {
        this.processTicks++;
    }

    resetProcessTicks() {
        this.processTicks = 0;
    }
}
