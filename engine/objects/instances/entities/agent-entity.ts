import { Position } from "../../position";
import { Pathfinder } from "../../util/pathfinder";
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

        const job = this.getJob();

        if (job) {
            const jobTarget = job.getCurrentTargetLocation();
            this.moveToTarget(jobTarget);
        }
    }

    setJob(job?: Job) {
        let assignedJob: Job | undefined;

        if (!job) {
            assignedJob = this.getJob();

            this.jobId = undefined;

            if (assignedJob && assignedJob.getAgent() === this) {
                assignedJob.setAgent(undefined);
            }

            return;
        }

        this.jobId = job.id;

        assignedJob = this.getJob();

        if (assignedJob && assignedJob.getAgent() !== this) {
            assignedJob.setAgent(this);
        }
    }

    getJob(): Job | undefined {
        return this.jobId
            ? this.game?.jobs.findOneById(this.jobId)
            : undefined;
    }

    getSpeed(): number {
        const job = this.getJob();

        return (job && job.started)
            ? this.velocityJob
            : this.velocityIdle;
    }

    moveToTarget(target: LocationEntity) {
        this.position = Pathfinder.proceedToPosition(this.position, target.position, this.getSpeed());
    }

    arrivedAtJobDestinationLocation(): boolean {
        const job = this.getJob();

        if (!job
            || !job.started
            || !Position.isSamePosition(this.position, job.destination.position)
        ) {
            return false;
        }

        job.finish();

        this.game?.jobs.remove(job);
        this.jobId = undefined;

        return true;
    }

    arrivedAtJobSourceLocation(): boolean {
        const job = this.getJob();

        if (!job) {
            return false;
        }

        if (job.started) {
            return true;
        }

        if (Position.isSamePosition(this.position, job.source.position)) {
            job.start();
        }

        return job.started;
    }
}
