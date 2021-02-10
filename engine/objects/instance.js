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
}
