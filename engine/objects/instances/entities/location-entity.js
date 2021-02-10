// @ts-nocheck

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
     * @param {Object} inputResourcesDefinition
     * @param {Object} outputResourcesDefinition
     * @returns {Boolean}
     */
    convertResources(inputResourcesDefinition, outputResourcesDefinition) {
        const resources = this.getResources();
        const inputResourcesDefinitionCheck = {...inputResourcesDefinition};

        resources.forEach((resource) => {
            if (inputResourcesDefinitionCheck.hasOwnProperty(resource.constructor.name)
                && inputResourcesDefinitionCheck[resource.constructor.name] > 0
            ) {
                inputResourcesDefinitionCheck[resource.constructor.name]--;
            }
        });

        let missingResources = false;
        Object.keys(inputResourcesDefinitionCheck).forEach((resourceClass) => {
            if (inputResourcesDefinitionCheck[resourceClass] > 0) {
                missingResources = true;
            }
        });

        if (missingResources) {
            return false;
        }

        resources.forEach((resource) => {
            if (inputResourcesDefinition.hasOwnProperty(resource.constructor.name)
                && inputResourcesDefinition[resource.constructor.name] > 0
            ) {
                this.game.resources.remove(resource);
                inputResourcesDefinition[resource.constructor.name]--;
            }
        });

        Object.keys(outputResourcesDefinition).forEach((resourceClass) => {
            while (outputResourcesDefinition[resourceClass] > 0) {
                const resource = (Function('return new ' + resourceClass))();
                this.createResource(resource);
                outputResourcesDefinition[resourceClass]--;
            }
        });

        return true;
    }
}
