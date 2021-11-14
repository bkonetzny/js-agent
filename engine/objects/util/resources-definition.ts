import { Resource } from "../instances/resource";

export class ResourcesDefinition {
    public definitions : object;

    constructor() {
        this.definitions = {};
    }

    addDefinition(resource: Resource, amount: number) {
        this.definitions[resource.constructor.name] = {
            resource: resource,
            amountRequested: amount,
            amountMatched: 0,
        };
    }

    hasResource(resource: Resource): boolean {
        return this.definitions.hasOwnProperty(resource.constructor.name);
    }

    matchResource(resource: Resource): boolean {
        if (!this.hasResource(resource)) {
            return false;
        }

        if (this.definitions[resource.constructor.name].amountMatched >= this.definitions[resource.constructor.name].amountRequested) {
            return false;
        }

        this.definitions[resource.constructor.name].amountMatched++;

        return true;
    }

    hasMissingResources(): boolean {
        let hasMissingResources = false;
        Object.keys(this.definitions).forEach((resourceClass) => {
            if (this.definitions[resourceClass].amountMatched < this.definitions[resourceClass].amountRequested) {
                hasMissingResources = true;
            }
        });

        return hasMissingResources;
    }

    resetMatches(): void {
        Object.keys(this.definitions).forEach((resourceClass) => {
            this.definitions[resourceClass].amountMatched = 0;
        });
    }

    forEachMissingResource(callback: CallableFunction): void {
        Object.keys(this.definitions).forEach((resourceClass) => {
            const amountDiff = this.definitions[resourceClass].amountRequested - this.definitions[resourceClass].amountMatched;

            if (!amountDiff) {
                return;
            }

            for (let index = 0; index < amountDiff; index++) {
                callback(resourceClass, this.definitions[resourceClass]);
            }
        });
    }
}
