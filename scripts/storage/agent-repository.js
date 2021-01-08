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

    /**
     * @return {AgentEntity|null}
     */
    findOneNextIdle() {
        return this.data.find((agent) => {
            return !agent.jobId;
        });
    }

    /**
     * @return {AgentEntity|null}
     */
    findOneRandomIdle() {
        let idleAgents = this.findIdle();

        Helper.shuffleArray(idleAgents);

        return idleAgents.shift();
    }

    /**
     * @param {Position} position
     * @return {AgentEntity|null}
     */
    findOneClosestIdle(position) {
        let idleAgents = this.findIdle();

        return Position.findClosestEntity(position, idleAgents);
    }

    /**
     * @return {Boolean}
     */
    hasIdle() {
        return !!this.findIdle();
    }
}
