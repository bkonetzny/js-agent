// @ts-check

import { Game } from "../game";
import { Helper } from "./helper";

export class Instance {
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

    /**
     * @returns {Instance}
     */
    getClonedInstance() {
        const clonedInstance = Object.assign(Object.create(this), this);
        clonedInstance.id = Helper.createUuid();

        return clonedInstance;
    }
}
