// @ts-check

class Job extends Instance {
    /**
     *
     * @param {LocationEntity} source
     * @param {LocationEntity} destination
     */
    constructor(source, destination) {
        super();
        this.source = source;
        this.destination = destination;
        this.agentId = null;
        this.started = false;
        this.finished = false;
    }

    /**
     *
     * @param {AgentEntity|null} agent
     */
    setAgent(agent) {
        let assignedAgent;

        if (!agent) {
            assignedAgent = this.getAgent();

            this.agentId = null;

            if (assignedAgent && assignedAgent.getJob() === this) {
                assignedAgent.setJob(null);
            }

            return;
        }

        this.agentId = agent.id;

        assignedAgent = this.getAgent();

        if (assignedAgent && assignedAgent.jobId !== this.id) {
            assignedAgent.setJob(this);
        }
    }

    /**
     *
     * @return {AgentEntity|null}
     */
    getAgent() {
        return this.agentId
            ? this.game.agents.findOneById(this.agentId)
            : null;
    }

    /**
     *
     * @return {LocationEntity}
     */
    getCurrentTargetLocation() {
        return this.started
            ? this.destination
            : this.source;
    }
}
