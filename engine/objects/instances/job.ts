import { Instance } from "../instance";
import { AgentEntity } from "./entities/agent-entity";
import { LocationEntity } from "./entities/location-entity";
import { Resource } from "./resource";

export class Job extends Instance {
    public source : LocationEntity;
    public destination : LocationEntity;
    public resourceId ?: string;
    public agentId ?: string;
    public started : boolean;
    public finished : boolean;

    constructor(source: LocationEntity, destination: LocationEntity, resource: Resource) {
        super();
        this.source = source;
        this.destination = destination;
        this.resourceId = resource ? resource.id : undefined;
        this.agentId = undefined;
        this.started = false;
        this.finished = false;
    }

    setAgent(agent?: AgentEntity) {
        let assignedAgent: AgentEntity | undefined;

        if (!agent) {
            assignedAgent = this.getAgent();

            this.agentId = undefined;

            if (assignedAgent && assignedAgent.getJob() === this) {
                assignedAgent.setJob(undefined);
            }

            return;
        }

        this.agentId = agent.id;

        assignedAgent = this.getAgent();

        if (assignedAgent && assignedAgent.jobId !== this.id) {
            assignedAgent.setJob(this);
        }
    }

    getAgent(): AgentEntity | undefined {
        return this.agentId
            ? this.game?.agents.findOneById(this.agentId)
            : undefined;
    }

    getResource(): Resource | undefined {
        return this.resourceId
            ? this.game?.resources.findOneById(this.resourceId)
            : undefined;
    }

    getCurrentTargetLocation(): LocationEntity {
        return this.started
            ? this.destination
            : this.source;
    }

    start() {
        if (this.started) {
            return;
        }

        this.getResource()?.assignToAgent();

        this.started = true;
    }

    finish() {
        if (!this.started) {
            return;
        }

        this.getResource()?.assignToLocation(this.destination);

        this.finished = true;
    }
}
