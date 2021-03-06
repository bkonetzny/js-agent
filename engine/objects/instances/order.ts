import { Instance } from "../instance";
import { ResourcesDefinition } from "../util/resources-definition";
import { LocationEntity } from "./entities/location-entity";

export class Order extends Instance {
    public locationId : string;
    public type : string;
    public resourcesDefinition : ResourcesDefinition;

    constructor(location: LocationEntity, type: string, resourcesDefinition: ResourcesDefinition) {
        super();
        this.locationId = location.id;
        this.type = type;
        this.resourcesDefinition = resourcesDefinition;
    }

    getLocation(): LocationEntity | undefined {
        return this.locationId
            ? this.game?.locations.findOneById(this.locationId)
            : undefined;
    }
}
