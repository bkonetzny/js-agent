// @ts-check

class JobManager {
    /**
     *
     * @param {Game} game
     */
    static process(game) {
        if (!game.agents.hasIdle() || !game.jobs.hasOpen()) {
            return;
        }

        let openJob, idleAgent;

        while (
            (openJob = game.jobs.findOneNextOpen())
            && (idleAgent = this.findIdleAgentForOpenJob(game, openJob))
        ) {
            openJob.setAgent(idleAgent);
        }
    }

    /**
     *
     * @param {Game} game
     * @param {Job} openJob
     * @return {AgentEntity|null}
     */
    static findIdleAgentForOpenJob(game, openJob) {
        switch (game.settings.assignIdleAgentToOpenJobStrategy) {
            case 'next':
                return game.agents.findOneNextIdle();
            case 'random':
                return game.agents.findOneRandomIdle();
            case 'closest':
                return game.agents.findOneClosestIdle(openJob.source.position);
            default:
                throw new Error('Invalid value for assignIdleAgentToOpenJobStrategy: ' + game.settings.assignIdleAgentToOpenJobStrategy);
        }
    }
}
