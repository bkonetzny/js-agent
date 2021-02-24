import { Job } from "../objects/instances/job";
import { ArrayStorage } from "./array-storage";

export class JobRepository extends ArrayStorage<Job> {
    remove(job: Job) {
        job.setAgent(undefined);

        return super.remove(job);
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
