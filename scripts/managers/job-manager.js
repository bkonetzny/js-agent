// @ts-check

class JobManager {
    /**
     *
     * @param {Game} game
     */
    static process(game) {
        /**
         * @type {AgentEntity[]}
         */
        var idleAgents = game.agents.filter((agent) => {
            return !agent.job;
        });

        /**
         * @type {Job[]}
         */
        var idleJobs = game.jobs.filter((job) => {
            return !job.agent;
        });

        if (idleAgents.length && idleJobs.length) {
            Helper.shuffleArray(idleAgents);

            idleJobs.forEach((job) => {
                if (!idleAgents.length) {
                    return;
                }

                job.setAgent(idleAgents.shift());
            });
        }
    }
}
