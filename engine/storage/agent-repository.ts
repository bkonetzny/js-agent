import { AgentEntity } from "../objects/instances/entities/agent-entity";
import { Position } from "../objects/position";
import { ArrayStorage } from "./array-storage";
import { shuffle } from 'lodash-es';

export class AgentRepository extends ArrayStorage<AgentEntity> {
    findIdle(): AgentEntity[] {
        return this.data.filter((agent) => {
            return !agent.jobId;
        });
    }

    findBusy(): AgentEntity[] {
        return this.data.filter((agent) => {
            return !!agent.jobId;
        });
    }

    findOneNextIdle(): AgentEntity | undefined {
        return this.data.find((agent) => {
            return !agent.jobId;
        });
    }

    findOneRandomIdle(): AgentEntity | undefined {
        const idleAgents = this.findIdle();

        if (!idleAgents) {
            return undefined;
        }

        const shuffledIdleAgents = shuffle(idleAgents);

        return shuffledIdleAgents.shift();
    }

    findOneClosestIdle(position: Position): AgentEntity | undefined {
        const idleAgents = this.findIdle();

        if (!idleAgents) {
            return undefined;
        }

        // @ts-ignore
        return Position.findClosestEntity(position, idleAgents);
    }

    hasIdle(): boolean {
        return !!this.findIdle();
    }
}
