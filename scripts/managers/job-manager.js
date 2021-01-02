// @ts-check

class JobManager {
    /**
     *
     * @param {Game} game
     */
    static process(game) {
        var idleAgents = game.agents.findIdle();
        var openJobs = game.jobs.findOpen();

        if (idleAgents.length && openJobs.length) {
            Helper.shuffleArray(idleAgents);

            openJobs.forEach((job) => {
                if (!idleAgents.length) {
                    return;
                }

                job.setAgent(idleAgents.shift());
            });
        }
    }
}
