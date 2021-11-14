import { LocationEntity } from "../objects/instances/entities/location-entity";
import { ArrayStorage } from "./array-storage";

export class LocationRepository extends ArrayStorage<LocationEntity> {
    remove(location: LocationEntity): boolean {
        this.game.orders.removeByLocation(location);
        this.game.jobs.removeByLocation(location);
        this.game.resources.removeByLocation(location);

        return super.remove(location);
    }
}
