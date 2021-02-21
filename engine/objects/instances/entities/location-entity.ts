import { ResourcesDefinition } from "../../util/resources-definition";
import { Entity } from "../entity";
import { Resource } from "../resource";

export class LocationEntity extends Entity {
    /**
     * To be overwritten in locations.
     */
    onCreate() {}
    onProcess() {}

    process() {
        super.process();

        this.onProcess();
    }

    getResources(): Resource[] {
        return this.game
            ? this.game.resources.findByLocation(this)
            : [];
    }

    createResource(resource: Resource) {
        this.attachResource(resource);

        this.game?.resources.add(resource);
    }

    attachResource(resource: Resource) {
        resource.game = this.game;
        resource.locationId = this.id;
        resource.owner = 'location';
    }

    convertResources(inputResourcesDefinition: ResourcesDefinition, outputResourcesDefinition: ResourcesDefinition): boolean {
        const resources = this.getResources();

        resources.forEach((resource) => {
            inputResourcesDefinition.matchResource(resource);
        });

        if (inputResourcesDefinition.hasMissingResources()) {
            return false;
        }

        inputResourcesDefinition.resetMatches();

        resources.forEach((resource) => {
            if (inputResourcesDefinition.matchResource(resource)) {
                this.game?.resources.remove(resource);
            }
        });

        Object.keys(outputResourcesDefinition.definitions).forEach((resourceClass) => {
            while (outputResourcesDefinition.definitions[resourceClass].amountMatched < outputResourcesDefinition.definitions[resourceClass].amountRequested) {
                this.createResource(outputResourcesDefinition.definitions[resourceClass].resource.getClonedInstance());
                outputResourcesDefinition.definitions[resourceClass].amountMatched++;
            }
        });

        return true;
    }
}
