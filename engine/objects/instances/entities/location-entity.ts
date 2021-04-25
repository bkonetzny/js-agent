import { Position } from "../../position";
import { ResourcesDefinition } from "../../util/resources-definition";
import { Entity } from "../entity";
import { Resource } from "../resource";

export abstract class LocationEntity extends Entity {
    actions: any;

    constructor(position: Position) {
        super(position);
        this.actions = {
            destroy: this.handleActionDestroy,
        };
    }

    toJSON() {
        return {
            ...super.toJSON(),
            ...{
                actions: Object.keys(this.actions),
                resources: this.getResources(),
            }
        };
    }

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

    handleAction(action: string, data: any): boolean | Error {
        if (!Object.keys(this.actions).includes(action)) {
            return new Error(`Action ${action} not found.`);
        }

        return this.actions[action](data);
    }

    handleActionDestroy(data: any): boolean | Error {
        return this.game!.locations.remove(this);
    }
}
