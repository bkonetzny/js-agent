import { Game } from "../game";
import { AgentEntity } from "../objects/instances/entities/agent-entity";
import { Job } from "../objects/instances/job";

export class JobManager {
    static process(game: Game) {
        if (!game.agents.hasIdle() || !game.jobs.hasOpen()) {
            return;
        }

        let openJob: Job | undefined, idleAgent: AgentEntity | undefined;

        while (
            (openJob = game.jobs.findOneNextOpen())
            && (idleAgent = this.findIdleAgentForOpenJob(game, openJob))
        ) {
            openJob.setAgent(idleAgent);
        }
    }

    static findIdleAgentForOpenJob(game: Game, openJob: Job): AgentEntity | undefined {
        switch (game.settings.assignIdleAgentToOpenJobStrategy) {
            case 'next':
                return game.agents.findOneNextIdle();
            case 'random':
                return game.agents.findOneRandomIdle();
            case 'closest':
                return game.agents.findOneClosestIdle(openJob.source.position);
            default:
                throw new Error(`Invalid value for assignIdleAgentToOpenJobStrategy: ${game.settings.assignIdleAgentToOpenJobStrategy}`);
        }
    }
}
