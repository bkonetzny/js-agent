// @ts-check

class LocationEntity extends Entity {
    /**
     *
     * @param {Position} position
     * @param {String} type
     */
    constructor(position, type) {
        super(position);
        this.type = type;
    }

    /**
     *
     * @param {Game} game
     */
    process(game) {
        super.process(game);

        if (this.type !== 'destination' && this.type !== 'destination-busy') {
            return;
        }

        if (this.type === 'destination') {
            if (this.processTicks < 50) {
                return;
            }
        }
        else if (this.type === 'destination-busy') {
            if (this.processTicks < 10) {
                return;
            }
        }

        this.processTicks = 0;

        /**
         * @type {LocationEntity[]}
         */
        var possibleSources = game.locations.filter((location) => {
            return location.type === 'source';
        });

        if (!possibleSources.length) {
            return;
        }

        Helper.shuffleArray(possibleSources);

        var job = new Job(possibleSources.shift(), this);

        game.addJob(job);
    }
}
