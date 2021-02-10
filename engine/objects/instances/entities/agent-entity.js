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

        if (this.arrivedAtJobDestinationLocation()) {
            return;
        }

        this.arrivedAtJobSourceLocation();

        let job = this.getJob();

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
        let assignedJob;

        if (!job) {
            assignedJob = this.getJob();

            this.jobId = null;

            if (assignedJob && assignedJob.getAgent() === this) {
                assignedJob.setAgent(null);
            }

            return;
        }

        this.jobId = job.id;

        assignedJob = this.getJob();

        if (assignedJob && assignedJob.getAgent() !== this) {
            assignedJob.setAgent(this);
        }
    }

    /**
     *
     * @returns {Job|null}
     */
    getJob() {
        return this.jobId
            ? this.game.jobs.findOneById(this.jobId)
            : null;
    }

    /**
     *
     * @returns {Number}
     */
    getSpeed() {
        let job = this.getJob();

        return (job && job.started)
            ? 2
            : 10;
    }

    /**
     *
     * @param {LocationEntity} target
     */
    moveToTarget(target) {
        let speed = this.getSpeed();
        let distanceX = Math.abs(this.position.x - target.position.x);
        let distanceY = Math.abs(this.position.y - target.position.y);

        if (this.position.x > target.position.x) {
            this.position.x = this.position.x - Math.min(distanceX, speed);
        }
        if (this.position.x < target.position.x) {
            this.position.x = this.position.x + Math.min(distanceX, speed);
        }

        if (this.position.y > target.position.y) {
            this.position.y = this.position.y - Math.min(distanceY, speed);
        }
        if (this.position.y < target.position.y) {
            this.position.y = this.position.y + Math.min(distanceY, speed);
        }
    }

    /**
     *
     * @returns {Boolean}
     */
    arrivedAtJobDestinationLocation() {
        let job = this.getJob();

        if (!job || !job.started) {
            return false;
        }

        if (this.position.x === job.destination.position.x
            && this.position.y === job.destination.position.y
        ) {
            job.finish();

            this.game.jobs.remove(job);
            this.jobId = null;

            return true;
        }

        return false;
    }

    /**
     *
     * @returns {Boolean}
     */
    arrivedAtJobSourceLocation() {
        let job = this.getJob();

        if (!job) {
            return false;
        }

        if (job.started) {
            return true;
        }

        if (this.position.x === job.source.position.x
            && this.position.y === job.source.position.y
        ) {
            job.start();
        }

        return job.started;
    }
}
