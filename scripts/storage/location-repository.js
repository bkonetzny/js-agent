// @ts-check

class LocationRepository extends ArrayStorage {
    /**
     * @override
     * @return {LocationEntity[]}
     */
    findAll() {
        return super.findAll();
    }

    /**
     * @override
     * @return {LocationEntity}
     */
    findOneById(id) {
        return super.findOneById(id);
    }

    /**
     *
     * @param {String} type
     * @return {LocationEntity[]}
     */
    findByType(type) {
        return this.data.filter((location) => {
            return location.type === type;
        });
    }

    /**
     * @param {Resource} resource
     * @param {Position} position
     * @return {LocationEntity|null}
     */
    findOneClosestByResource(resource, position) {
        let locationsWithResource = this.data.filter((location) => {
            return location.resources.find((locationResource) => {
                return locationResource.constructor.name === resource.constructor.name;
            });
        });

        if (!locationsWithResource.length) {
            return null;
        }

        return Position.findClosestEntity(position, locationsWithResource);
    }
}
