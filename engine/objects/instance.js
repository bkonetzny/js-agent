// @ts-check

import { Game } from "../game";
import { v4 as uuidv4 } from 'uuid';

export class Instance {
    constructor() {
        this.game = null;
        this.id = uuidv4();
    }

    /**
     *
     * @param {Game} game
     */
    setGame(game) {
        this.game = game;
    }

    /**
     * @returns {Instance}
     */
    getClonedInstance() {
        const clonedInstance = Object.assign(Object.create(this), this);
        clonedInstance.id = uuidv4();

        return clonedInstance;
    }
}
