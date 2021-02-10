// @ts-nocheck

import { LocationEntity } from "../objects/instances/entities/location-entity";
import { ArrayStorage } from "./array-storage";

export class LocationRepository extends ArrayStorage {
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
