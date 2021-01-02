// @ts-check

class AgentRepository extends ArrayStorage {
    /**
     * @override
     * @return {AgentEntity[]}
     */
    findAll() {
        return super.findAll();
    }

    /**
     * @override
     * @return {AgentEntity}
     */
    findOneById(id) {
        return super.findOneById(id);
    }

    /**
     * @return {AgentEntity[]}
     */
    findIdle() {
        return this.data.filter((agent) => {
            return !agent.jobId;
        });
    }

    /**
     * @return {AgentEntity[]}
     */
    findBusy() {
        return this.data.filter((agent) => {
            return !!agent.jobId;
        });
    }
}
