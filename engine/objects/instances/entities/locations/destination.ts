import { ResourcesDefinition } from "../../../util/resources-definition";
import { Order } from "../../order";
import { ItemA } from "../../resources/item-a";
import { ItemB } from "../../resources/item-b";
import { LocationEntity } from "../location-entity";

export class DestinationLocation extends LocationEntity {
    public procesAfterTicks : number;

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
        this.convertResourcesIfPossible();
        this.createOrderIfNotExists();

        /*
        let matchingResource = this.game?.resources.findOneClosestByType(new ItemA(), this.position);

        if (!matchingResource) {
            return;
        }

        // @ts-ignore
        let job = new Job(matchingResource.getLocation(), this, matchingResource);

        matchingResource.assignToJob(job);

        this.game?.addJob(job);
        */
    }

    convertResourcesIfPossible() {
        const inputResourcesDefinition = new ResourcesDefinition();
        inputResourcesDefinition.addDefinition(new ItemA(), 5);

        const outputResourcesDefinition = new ResourcesDefinition();
        outputResourcesDefinition.addDefinition(new ItemB(), 2);

        this.convertResources(inputResourcesDefinition, outputResourcesDefinition);
    }

    createOrderIfNotExists() {
        if (this.game?.orders.hasOpenOrderForLocation(this, 'default')) {
            return;
        }

        const orderResourcesDefinition = new ResourcesDefinition();
        orderResourcesDefinition.addDefinition(new ItemA(), 5);

        const order = new Order(this, 'default', orderResourcesDefinition);

        this.game?.orders.add(order);
    }
}
