// @ts-check

class AgentEntity extends Entity {
    /**
     *
     * @param {Position} position
     */
    constructor(position) {
        super(position);
        this.job = null;
    }

    /**
     *
     * @param {Game} game
     */
    process(game) {
        super.process(game);

        if (this.arrivedAtJobDestinationLocation()) {
            return;
        }

        this.arrivedAtJobSourceLocation();

        const jobTarget = this.job.getCurrentTargetLocation();
        this.moveToTarget(jobTarget);
    }

    /**
     *
     * @param {Job} job
     */
    setJob(job) {
        this.job = job;

        if (this.job.agent !== this) {
            this.job.setAgent(this);
        }
    }

    /**
     *
     * @param {LocationEntity} target
     */
    moveToTarget(target) {
        if (this.position.x > target.position.x) {
            this.position.x--;
        }
        if (this.position.x < target.position.x) {
            this.position.x++;
        }

        if (this.position.y > target.position.y) {
            this.position.y--;
        }
        if (this.position.y < target.position.y) {
            this.position.y++;
        }
    }

    /**
     *
     * @return {Boolean}
     */
    arrivedAtJobDestinationLocation() {
        if (!this.job || !this.job.started) {
            return false;
        }

        if (this.position.x === this.job.destination.position.x
            && this.position.y === this.job.destination.position.y
        ) {
            this.job.finished = true;
            this.job = null;

            return true;
        }

        return false;
    }

    /**
     *
     * @return {Boolean}
     */
    arrivedAtJobSourceLocation() {
        if (!this.job) {
            return false;
        }

        if (this.job.started) {
            return true;
        }

        if (this.position.x === this.job.source.position.x
            && this.position.y === this.job.source.position.y
        ) {
            this.job.started = true;
        }

        return this.job.started;
    }
}
