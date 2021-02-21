import { ResourcesDefinition } from "../../../util/resources-definition";
import { Job } from "../../job";
import { ItemA } from "../../resources/item-a";
import { ItemB } from "../../resources/item-b";
import { LocationEntity } from "../location-entity";

export class DestinationLocation extends LocationEntity {
    public procesAfterTicks : integer;

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

        let inputResourcesDefinition = new ResourcesDefinition();
        inputResourcesDefinition.addDefinition(new ItemA(), 5);

        let outputResourcesDefinition = new ResourcesDefinition();
        outputResourcesDefinition.addDefinition(new ItemB(), 2);

        this.convertResources(inputResourcesDefinition, outputResourcesDefinition);

        let matchingResource = this.game?.resources.findOneClosestByType(new ItemA(), this.position);

        if (!matchingResource) {
            return;
        }

        // @ts-ignore
        let job = new Job(matchingResource.getLocation(), this, matchingResource);

        matchingResource.assignToJob(job);

        this.game?.addJob(job);
    }
}
