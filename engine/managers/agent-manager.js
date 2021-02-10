// @ts-check

import { Game } from "../game";

export class AgentManager {
    /**
     *
     * @param {Game} game
     */
    static process(game) {
        game.agents.findBusy().forEach((agent) => {
            agent.process();
        });
    }
}
