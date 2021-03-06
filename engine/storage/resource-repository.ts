import { LocationEntity } from "../objects/instances/entities/location-entity";
import { Resource } from "../objects/instances/resource";
import { Position } from "../objects/position";
import { ArrayStorage } from "./array-storage";

export class ResourceRepository extends ArrayStorage<Resource> {
    findByLocation(location: LocationEntity): Resource[] {
        return this.data.filter((resource) => {
            return (
                resource.owner === 'location'
                && resource.locationId === location.id
            );
        });
    }

    findOneClosestByType(type: Resource, position: Position): Resource | undefined {
        let pickableResources = this.data.filter((resource) => {
            return (
                resource.pickable
                && resource.constructor.name === type.constructor.name
            );
        });

        if (!pickableResources.length) {
            return undefined;
        }

        let locationIds: Array<String> = [];

        let uniqueLocationResources = pickableResources.filter((resource) => {
            if (!resource.locationId || locationIds.includes(resource.locationId)) {
                return false;
            }

            locationIds.push(resource.locationId);

            return true;
        });

        let possibleLocations = uniqueLocationResources.map((resource) => {
            return resource.getLocation();
        });

        if (!possibleLocations.length) {
            return undefined;
        }

        possibleLocations = possibleLocations.filter((location) => {
            return !!location;
        });

        if (!possibleLocations.length) {
            return undefined;
        }

        // @ts-ignore
        let closestLocation = Position.findClosestEntity(position, possibleLocations);

        if (!closestLocation) {
            return undefined;
        }

        return uniqueLocationResources.find((resource) => {
            return resource.locationId === closestLocation?.id;
        });
    }
}
