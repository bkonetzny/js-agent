import { Game } from "../game";

export class AgentManager {
    static process(game: Game) {
        game.agents.findBusy().forEach((agent) => {
            agent.process();
        });
    }
}
