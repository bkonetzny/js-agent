// @ts-check

import { Instance } from "../objects/instance";
import { Job } from "../objects/instances/job";
import { ArrayStorage } from "./array-storage";

export class JobRepository extends ArrayStorage {
    /**
     * @override
     * @param {Job} job
     */
    remove(job) {
        job.setAgent(null);

        return super.remove(job);
    }

    /**
     * @override
     * @returns {Instance[]}
     */
    findAll() {
        return super.findAll();
    }

    /**
     * @override
     * @returns {Instance}
     */
    findOneById(id) {
        return super.findOneById(id);
    }

    /**
     * @returns {Job[]}
     */
    findOpen() {
        return this.data.filter((job) => {
            return !job.agentId;
        });
    }

    /**
     * @returns {Job|null}
     */
    findOneNextOpen() {
        return this.data.find((job) => {
            return !job.agentId;
        });
    }

    /**
     * @returns {Boolean}
     */
    hasOpen() {
        return !!this.findOpen();
    }
}
