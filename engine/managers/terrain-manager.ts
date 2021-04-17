import { Game } from "../game";
import { Terrain } from "../objects/terrain";

export class TerrainManager {
    static generate(game: Game): Terrain {
        return new Terrain(game.settings.terrain.x, game.settings.terrain.y);
    }
}
