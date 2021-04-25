import { Game } from "../game";
import { v4 as uuidv4 } from 'uuid';

export abstract class Instance {
    public game ?: Game;
    public id : string;

    constructor() {
        this.game = undefined;
        this.id = uuidv4();
    }

    toJSON() {
        return {
            id: this.id,
            type: this.constructor.name
        };
    }

    setGame(game: Game) {
        this.game = game;
    }

    getClonedInstance(): Instance {
        const clonedInstance = Object.assign(Object.create(this), this);
        clonedInstance.id = uuidv4();

        return clonedInstance;
    }
}
