// @ts-check

import { Game } from "../game";

export class LocationManager {
    /**
     *
     * @param {Game} game
     */
    static process(game) {
        game.locations.findAll().forEach((location) => {
            location.process();
        });
    }
}
