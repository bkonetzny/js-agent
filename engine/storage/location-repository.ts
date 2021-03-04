import { LocationEntity } from "../objects/instances/entities/location-entity";
import { ArrayStorage } from "./array-storage";

export class LocationRepository extends ArrayStorage<LocationEntity> {
    /*findByType(type: string): LocationEntity[] {
        return this.data.filter((location) => {
            return location.type === type;
        });
    }*/
}
