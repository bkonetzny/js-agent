import { LocationEntity } from "../objects/instances/entities/location-entity";
import { Job } from "../objects/instances/job";
import { ArrayStorage } from "./array-storage";

export class JobRepository extends ArrayStorage<Job> {
    remove(job: Job): boolean {
        job.setAgent(undefined);

        return super.remove(job);
    }

    removeByLocation(location: LocationEntity): boolean {
        this.data.forEach((job) => {
            if (job.destination.id === location.id
                || (
                    job.source.id === location.id
                    && !job.started
                )
            ) {
                console.log('job removed', job);
                this.remove(job);
            }
        });

        return true;
    }

    findOpen(): Job[] {
        return this.data.filter((job) => {
            return !job.agentId;
        });
    }

    findOneNextOpen(): Job | undefined {
        return this.data.find((job) => {
            return !job.agentId;
        });
    }

    hasOpen(): boolean {
        return !!this.findOpen();
    }
}
