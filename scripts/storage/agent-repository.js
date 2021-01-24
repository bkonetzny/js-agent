// @ts-check

class AgentRepository extends ArrayStorage {
    /**
     * @override
     * @returns {AgentEntity[]}
     */
    findAll() {
        return super.findAll();
    }

    /**
     * @override
     * @returns {AgentEntity}
     */
    findOneById(id) {
        return super.findOneById(id);
    }

    /**
     * @returns {AgentEntity[]}
     */
    findIdle() {
        return this.data.filter((agent) => {
            return !agent.jobId;
        });
    }

    /**
     * @returns {AgentEntity[]}
     */
    findBusy() {
        return this.data.filter((agent) => {
            return !!agent.jobId;
        });
    }

    /**
     * @returns {AgentEntity|null}
     */
    findOneNextIdle() {
        return this.data.find((agent) => {
            return !agent.jobId;
        });
    }

    /**
     * @returns {AgentEntity|null}
     */
    findOneRandomIdle() {
        let idleAgents = this.findIdle();

        Helper.shuffleArray(idleAgents);

        return idleAgents.shift();
    }

    /**
     * @param {Position} position
     * @returns {AgentEntity|null}
     */
    findOneClosestIdle(position) {
        let idleAgents = this.findIdle();

        return Position.findClosestEntity(position, idleAgents);
    }

    /**
     * @returns {Boolean}
     */
    hasIdle() {
        return !!this.findIdle();
    }
}
