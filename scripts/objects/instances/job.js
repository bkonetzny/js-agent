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
        this.agent = null;
        this.started = false;
        this.finished = false;
    }

    /**
     *
     * @param {AgentEntity} agent
     */
    setAgent(agent) {
        this.agent = agent;

        if (this.agent.job !== this) {
            this.agent.setJob(this);
        }
    }

    /**
     *
     * @return {LocationEntity}
     */
    getCurrentTargetLocation() {
        return this.started ? this.destination : this.source;
    }
}
