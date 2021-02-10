// @ts-nocheck

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

    /**
     *
     * @returns {Resource[]}
     */
    getResources() {
        return this.game.resources.findByLocation(this);
    }

    /**
     *
     * @param {Resource} resource
     */
    createResource(resource) {
        this.attachResource(resource);

        this.game.resources.add(resource);
    }

    /**
     *
     * @param {Resource} resource
     */
    attachResource(resource) {
        resource.game = this.game;
        resource.locationId = this.id;
        resource.owner = 'location';
    }

    /**
     *
     * @param {ResourcesDefinition} inputResourcesDefinition
     * @param {ResourcesDefinition} outputResourcesDefinition
     * @returns {Boolean}
     */
    convertResources(inputResourcesDefinition, outputResourcesDefinition) {
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
                this.game.resources.remove(resource);
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
