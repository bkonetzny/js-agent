import { LocationEntity } from "../objects/instances/entities/location-entity";
import * as Locations from "../objects/instances/entities/locations";
import { Position } from "../objects/position";

export class LocationRegistry {
    static createLocation(locationId: string, position: Position) : LocationEntity {
        return new (Locations[locationId])(position);
    }

    static getLocations() : Array<any> {
        return Object.keys(Locations).map((id) => {
            return {
                id,
            };
        });
    }
}
