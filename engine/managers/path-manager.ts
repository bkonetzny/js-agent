import { Game } from "../game";
import { Job } from "../objects/instances/job";
import { Resource } from "../objects/instances/resource";

export class PathManager {
    static process(game: Game) {
        const usedPathIds = game.agents.findAll().map((agent) => {
            return agent.pathId;
        });

        const uniqueUsedPathIds = [...new Set(usedPathIds)];

        game.paths.findAll().forEach((path) => {
            if (!uniqueUsedPathIds.includes(path.id)) {
                console.log('Removing obsolete path', path);
                game.paths.remove(path);
            }
        });
    }
}
