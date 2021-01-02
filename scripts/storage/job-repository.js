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
     * @return {Job[]}
     */
    findAll() {
        return super.findAll();
    }

    /**
     * @override
     * @return {Job}
     */
    findOneById(id) {
        return super.findOneById(id);
    }

    /**
     * @return {Job[]}
     */
    findOpen() {
        return this.data.filter((job) => {
            return !job.agentId;
        });
    }
}
