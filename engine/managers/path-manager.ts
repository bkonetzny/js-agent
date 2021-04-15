import { Game } from "../game";

export class PathManager {
    static process(game: Game) {
        const usedPathIds = game.agents.findAll().map((agent) => {
            return agent.pathId;
        });

        const uniqueUsedPathIds = [...new Set(usedPathIds)];

        game.paths.findAll().forEach((path) => {
            if (!uniqueUsedPathIds.includes(path.id)) {
                game.paths.remove(path);
            }
        });
    }
}
