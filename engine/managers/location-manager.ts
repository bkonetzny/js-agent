import { Game } from "../game";

export class LocationManager {
    static process(game: Game) {
        game.locations.findAll().forEach((location) => {
            location.process();
        });
    }
}
