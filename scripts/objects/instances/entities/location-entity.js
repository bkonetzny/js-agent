// @ts-check

class LocationEntity extends Entity {
    /**
     *
     * @param {Position} position
     */
    constructor(position) {
        super(position);
        this.resources = [];
    }
}
