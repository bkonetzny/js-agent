import { LocationEntity } from "../objects/instances/entities/location-entity";
import { ArrayStorage } from "./array-storage";

export class LocationRepository extends ArrayStorage<LocationEntity> {
    remove(location: LocationEntity): boolean {
        this.game.events.emit('location:remove:'+location.id, location);

        this.game.resources.removeByLocation(location);

        return super.remove(location);
    }
}
