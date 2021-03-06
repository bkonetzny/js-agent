import { Game } from "../game";

export class OrderManager {
    static process(game: Game) {
        game.orders.findAll().forEach((order) => {
            console.log('process', order.resourcesDefinition);
        });
    }
}
