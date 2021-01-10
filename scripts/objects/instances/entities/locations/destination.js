// @ts-check

class DestinationLocation extends LocationEntity {
    onProcess() {
        if (this.processTicks < 50) {
            return;
        }

        this.resetProcessTicks();

        let matchingResource = this.game.resources.findOneClosestByType((new ItemA()).constructor.name, this.position);

        if (!matchingResource) {
            return;
        }

        let job = new Job(matchingResource.getLocation(), this, matchingResource);

        matchingResource.assignToJob(job);

        this.game.addJob(job);
    }
}
