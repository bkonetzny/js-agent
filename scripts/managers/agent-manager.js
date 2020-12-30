// @ts-check

class AgentManager {
    /**
     *
     * @param {Game} game
     */
    static process(game) {
        /**
         * @type {AgentEntity[]}
         */
        var busyAgents = game.agents.filter((agent) => {
            return !!agent.job;
        });

        busyAgents.forEach((agent) => {
            agent.process(game);
        });
    }
}
