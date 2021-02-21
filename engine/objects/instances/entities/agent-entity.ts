import { Position } from "../../position";
import { Entity } from "../entity";
import { Job } from "../job";
import { LocationEntity } from "./location-entity";

export class AgentEntity extends Entity {
    public jobId ?: string;
    private velocityIdle : number;
    private velocityJob : number;

    constructor(position: Position) {
        super(position);
        this.jobId = undefined;
        this.velocityIdle = 5;
        this.velocityJob = 1;
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

    setJob(job: Job | null) {
        let assignedJob;

        if (!job) {
            assignedJob = this.getJob();

            this.jobId = undefined;

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

    getJob(): any | null {
        return this.jobId
            ? this.game?.jobs.findOneById(this.jobId)
            : null;
    }

    getSpeed(): number {
        let job = this.getJob();

        return (job && job.started)
            ? this.velocityJob
            : this.velocityIdle;
    }

    moveToTarget(target: LocationEntity) {
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

    arrivedAtJobDestinationLocation(): boolean {
        let job = this.getJob();

        if (!job || !job.started) {
            return false;
        }

        if (this.position.x === job.destination.position.x
            && this.position.y === job.destination.position.y
        ) {
            job.finish();

            this.game?.jobs.remove(job);
            this.jobId = undefined;

            return true;
        }

        return false;
    }

    arrivedAtJobSourceLocation(): boolean {
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
