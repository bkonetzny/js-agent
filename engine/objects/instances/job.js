// @ts-nocheck

import { Instance } from "../instance";
import { AgentEntity } from "./entities/agent-entity";
import { LocationEntity } from "./entities/location-entity";
import { Resource } from "./resource";

export class Job extends Instance {
    /**
     *
     * @param {LocationEntity} source
     * @param {LocationEntity} destination
     * @param {Resource} resource
     */
    constructor(source, destination, resource) {
        super();
        this.source = source;
        this.destination = destination;
        this.resourceId = resource ? resource.id : null;
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
     * @returns {AgentEntity|null}
     */
    getAgent() {
        return this.agentId
            ? this.game.agents.findOneById(this.agentId)
            : null;
    }

    /**
     *
     * @returns {any|null}
     */
    getResource() {
        return this.resourceId
            ? this.game.resources.findOneById(this.resourceId)
            : null;
    }

    /**
     *
     * @returns {LocationEntity}
     */
    getCurrentTargetLocation() {
        return this.started
            ? this.destination
            : this.source;
    }

    start() {
        if (this.started) {
            return;
        }

        this.getResource().assignToAgent();

        this.started = true;
    }

    finish() {
        if (!this.started) {
            return;
        }

        this.getResource().assignToLocation(this.destination);

        this.finished = true;
    }
}
