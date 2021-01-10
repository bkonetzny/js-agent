// @ts-check

class ResourceRepository extends ArrayStorage {
    /**
     *
     * @param {LocationEntity} location
     * @return {Resource[]}
     */
    findByLocation(location) {
        return this.data.filter((resource) => {
            return (
                resource.owner === 'location'
                && resource.locationId === location.id
            );
        });
    }
}
