// @ts-check

class LocationManager {
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
