// @ts-check

class JobRepository extends ArrayStorage {
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
     * @returns {Job[]}
     */
    findAll() {
        return super.findAll();
    }

    /**
     * @override
     * @returns {Job}
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
