import { Instance } from "../instance";
import { ResourcesDefinition } from "../util/resources-definition";
import { LocationEntity } from "./entities/location-entity";
import { Resource } from "./resource";

export class Order extends Instance {
    public locationId : string;
    public type : string;
    public resourcesDefinition : ResourcesDefinition;
    public resources : Array<string>;

    constructor(location: LocationEntity, type: string, resourcesDefinition: ResourcesDefinition) {
        super();
        this.locationId = location.id;
        this.type = type;
        this.resourcesDefinition = resourcesDefinition;
        this.resources = [];
    }

    toJSON() {
        return {
            ...super.toJSON(),
            ...{
                locationId: this.locationId,
                orderType: this.type,
                resourcesDefinition: this.resourcesDefinition,
                resources: this.resources,
            }
        };
    }

    isFulfilled(): boolean {
        return !this.resourcesDefinition.hasMissingResources();
    }

    getLocation(): LocationEntity | undefined {
        return this.game?.locations.findOneById(this.locationId);
    }

    forEachMissingResource(callback: CallableFunction) {
        this.resourcesDefinition.forEachMissingResource((resourceClass, resourceDefinition) => {
            /** @var Resource */
            const resource = callback(resourceClass, resourceDefinition);

            if (resource) {
                this.assignResource(resource);
            }
        });
    }

    assignResource(resource: Resource) {
        this.resources.push(resource.id);
        this.resourcesDefinition.matchResource(resource);
    }
}
