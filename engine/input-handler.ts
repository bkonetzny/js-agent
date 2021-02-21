import { Ui } from "../ui/scripts/ui";
import { Game } from "./game";

export class InputHandler {
    private game : Game;

    constructor(game: Game, ui: Ui) {
        this.game = game;
        ui.setInputHandler(this);
    }

    command(command: string, data: object): any {
        return this.game.command(command, data);
    }
}
