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

    process() {
        super.process();

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
        var possibleSources = this.game.locations.findByType('source');

        if (!possibleSources.length) {
            return;
        }

        Helper.shuffleArray(possibleSources);

        var job = new Job(possibleSources.shift(), this);

        this.game.addJob(job);
    }
}
