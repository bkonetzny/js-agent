// @ts-nocheck

import { Resource } from "../instances/resource";

export class ResourcesDefinition {
    constructor() {
        this.definitions = {};
    }

    /**
     *
     * @param {Resource} resource
     * @param {Number} amount
     */
    addDefinition(resource, amount) {
        this.definitions[resource.constructor.name] = {
            resource: resource,
            amountRequested: amount,
            amountMatched: 0,
        };
    }

    /**
     *
     * @param {Resource} resource
     * @returns {Boolean}
     */
    hasResource(resource) {
        return this.definitions.hasOwnProperty(resource.constructor.name);
    }

    /**
     *
     * @param {Resource} resource
     * @returns {Boolean}
     */
    matchResource(resource) {
        if (!this.hasResource(resource)) {
            return false;
        }

        if (this.definitions[resource.constructor.name].amountMatched >= this.definitions[resource.constructor.name].amountRequested) {
            return false;
        }

        this.definitions[resource.constructor.name].amountMatched++;

        return true;
    }

    /**
     *
     * @returns {Boolean}
     */
    hasMissingResources() {
        let hasMissingResources = false;
        Object.keys(this.definitions).forEach((resourceClass) => {
            if (this.definitions[resourceClass].amountMatched < this.definitions[resourceClass].amountRequested) {
                hasMissingResources = true;
            }
        });

        return hasMissingResources;
    }

    resetMatches() {
        Object.keys(this.definitions).forEach((resourceClass) => {
            this.definitions[resourceClass].amountMatched = 0;
        });
    }
}