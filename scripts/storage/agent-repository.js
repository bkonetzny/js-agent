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
     * @param {LocationEntity} location
     * @return {AgentEntity|null}
     */
    findOneClosestIdle(location) {
        let idleAgents = this.findIdle();
        let closestDistance = null;
        let closestAgent = null;

        idleAgents.forEach((agent) => {
            let distance = Math.abs(location.position.x - agent.position.x) + Math.abs(location.position.y - agent.position.y);

            if (!closestAgent || distance < closestDistance) {
                closestAgent = agent;
                closestDistance = distance;
            }
        });

        return closestAgent;
    }

    /**
     * @return {Boolean}
     */
    hasIdle() {
        return !!this.findIdle();
    }
}
