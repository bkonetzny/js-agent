// @ts-check

class LocationRepository extends ArrayStorage {
    /**
     * @override
     * @returns {LocationEntity[]}
     */
    findAll() {
        return super.findAll();
    }

    /**
     * @override
     * @returns {LocationEntity}
     */
    findOneById(id) {
        return super.findOneById(id);
    }

    /**
     *
     * @param {String} type
     * @returns {LocationEntity[]}
     */
    findByType(type) {
        return this.data.filter((location) => {
            return location.type === type;
        });
    }
}
