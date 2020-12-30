// @ts-check

class LocationManager {
    /**
     *
     * @param {Game} game
     */
    static process(game) {
        game.locations.forEach((location) => {
            location.process(game);
        });
    }
}
