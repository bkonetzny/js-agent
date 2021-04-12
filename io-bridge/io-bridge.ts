import { Ui } from "../ui/scripts/ui";
import { Game } from "../engine/game";
import { InputHandler, OutputHandler } from "./handlers";

export class IoBridge {
    constructor(game: Game, ui: Ui) {
        new InputHandler(game, ui);
        new OutputHandler(game, ui);
    }
}
