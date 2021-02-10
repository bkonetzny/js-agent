// @ts-check

class DestinationLocation extends LocationEntity {
    constructor(...args) {
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

        let matchingResource = this.game.resources.findOneClosestByType((new ItemA()).constructor.name, this.position);

        if (!matchingResource) {
            return;
        }

        let job = new Job(matchingResource.getLocation(), this, matchingResource);

        matchingResource.assignToJob(job);

        this.game.addJob(job);
    }
}
