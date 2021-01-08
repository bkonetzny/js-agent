// @ts-check

class DestinationBusyLocation extends LocationEntity {
    process() {
        super.process();

        if (this.processTicks < 10) {
            return;
        }

        this.resetProcessTicks();

        let matchingSource = this.game.locations.findOneClosestByResource(new ItemA(), this.position);

        if (!matchingSource) {
            return;
        }

        let job = new Job(matchingSource, this);

        this.game.addJob(job);
    }
}
