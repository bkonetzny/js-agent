// @ts-check

class ResourceRepository extends ArrayStorage {
    /**
     *
     * @param {LocationEntity} location
     * @returns {Resource[]}
     */
    findByLocation(location) {
        return this.data.filter((resource) => {
            return (
                resource.owner === 'location'
                && resource.locationId === location.id
            );
        });
    }

    /**
     * @param {String} type
     * @param {Position} position
     * @returns {Resource|null}
     */
    findOneClosestByType(type, position) {
        let pickableResources = this.data.filter((resource) => {
            return (
                resource.pickable
                && resource.constructor.name === type
            );
        });

        if (!pickableResources.length) {
            return null;
        }

        let locationIds = [];

        let uniqueLocationResources = pickableResources.filter((resource) => {
            if (locationIds.includes(resource.locationId)) {
                return false;
            }

            locationIds.push(resource.locationId);

            return true;
        });

        let possibleLocations = uniqueLocationResources.map((resource) => {
            return resource.getLocation();
        });

        let closestLocation = Position.findClosestEntity(position, possibleLocations);

        if (!closestLocation) {
            return null;
        }

        return uniqueLocationResources.find((resource) => {
            return resource.locationId === closestLocation.id;
        });
    }
}
