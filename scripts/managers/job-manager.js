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
            && (idleAgent = game.agents.findOneClosestIdle(openJob.source))
        ) {
            openJob.setAgent(idleAgent);
        }
    }
}
