// @ts-check

import { Job } from "../../job";
import { Resource } from "../../resource";
import { ItemA } from "../../resources/item-a";
import { ItemB } from "../../resources/item-b";
import { LocationEntity } from "../location-entity";

export class DestinationLocation extends LocationEntity {
    constructor(...args) {
        // @ts-ignore
        super(...args);

        this.procesAfterTicks = 50;
    }

    onProcess() {
        if (this.processTicks < this.procesAfterTicks) {
            return;
        }

        this.resetProcessTicks();

        let inputResourcesDefinition = {};
        inputResourcesDefinition[Resource.getClassName(new ItemA())] = 5;

        let outputResourcesDefinition = {};
        outputResourcesDefinition[Resource.getClassName(new ItemB())] = 1;

        this.convertResources(inputResourcesDefinition, outputResourcesDefinition);

        // @ts-ignore
        let matchingResource = this.game.resources.findOneClosestByType((new ItemA()).constructor.name, this.position);

        if (!matchingResource) {
            return;
        }

        // @ts-ignore
        let job = new Job(matchingResource.getLocation(), this, matchingResource);

        matchingResource.assignToJob(job);

        // @ts-ignore
        this.game.addJob(job);
    }
}
