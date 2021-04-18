import { Position } from "../../position";
import { Entity } from "../entity";
import { Job } from "../job";
import { Path } from "../path";
import { LocationEntity } from "./location-entity";

export class AgentEntity extends Entity {
    public jobId ?: string;
    public pathId ?: string;
    private velocityIdle : number;
    private velocityJob : number;

    constructor(position: Position) {
        super(position);
        this.jobId = undefined;
        this.pathId = undefined;
        this.velocityIdle = 5;
        this.velocityJob = 1;
    }

    toJSON() {
        return {
            ...super.toJSON(),
            ...{
                jobId: this.jobId,
            }
        };
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
        let path : Path | undefined;

        if (this.pathId) {
            path = this.game?.paths.findOneById(this.pathId);
        }

        if (!path
            || !Position.isSamePosition(path.destination, target.position)
        ) {
            path = this.game?.paths.findOneBySourceAndDestinationOrCreate(this.position, target.position);
        }

        if (!path) {
            console.error('No path found or created.');
            this.pathId = undefined;
            return;
        }

        this.pathId = path.id;

        const newPosition = path.proceedOnPath(this.position, this.getSpeed());

        if (!newPosition) {
            console.error('No position to proceed to.', this.position, path);
            return;
        }

        this.position = newPosition;
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
