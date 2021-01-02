// @ts-check

class AgentEntity extends Entity {
    /**
     *
     * @param {Position} position
     */
    constructor(position) {
        super(position);
        this.jobId = null;
    }

    process() {
        super.process();

        console.log('process', this.id);

        console.log(this.arrivedAtJobDestinationLocation());

        if (this.arrivedAtJobDestinationLocation()) {
            return;
        }

        this.arrivedAtJobSourceLocation();

        var job = this.getJob();

        if (job) {
            const jobTarget = job.getCurrentTargetLocation();
            this.moveToTarget(jobTarget);
        }
    }

    /**
     *
     * @param {Job|null} job
     */
    setJob(job) {
        if (!job) {
            var assignedJob = this.getJob();

            this.jobId = null;

            if (assignedJob && assignedJob.getAgent() === this) {
                assignedJob.setAgent(null);
            }

            return;
        }

        this.jobId = job.id;

        var assignedJob = this.getJob();

        if (assignedJob && assignedJob.getAgent() !== this) {
            assignedJob.setAgent(this);
        }
    }

    /**
     *
     * @return {Job|null}
     */
    getJob() {
        return this.jobId
            ? this.game.jobs.findOneById(this.jobId)
            : null;
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
        var job = this.getJob();

        if (!job || !job.started) {
            return false;
        }

        if (this.position.x === job.destination.position.x
            && this.position.y === job.destination.position.y
        ) {
            job.finished = true;
            this.game.jobs.remove(job);
            this.jobId = null;

            return true;
        }

        return false;
    }

    /**
     *
     * @return {Boolean}
     */
    arrivedAtJobSourceLocation() {
        var job = this.getJob();

        if (!job) {
            return false;
        }

        if (job.started) {
            return true;
        }

        if (this.position.x === job.source.position.x
            && this.position.y === job.source.position.y
        ) {
            job.started = true;
        }

        return job.started;
    }
}
