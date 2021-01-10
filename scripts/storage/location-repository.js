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
}
