// @ts-check

class LocationEntity extends Entity {
    /**
     * To be overwritten in locations.
     */
    onCreate() {}
    onProcess() {}

    process() {
        super.process();

        this.onProcess();
    }

    /**
     *
     * @return {Resource[]}
     */
    getResources() {
        return this.game.resources.findByLocation(this);
    }

    /**
     *
     * @param {Resource} resource
     */
    createResource(resource) {
        this.attachResource(resource);

        this.game.resources.add(resource);
    }

    /**
     *
     * @param {Resource} resource
     */
    attachResource(resource) {
        resource.game = this.game;
        resource.locationId = this.id;
        resource.owner = 'location';
    }
}
