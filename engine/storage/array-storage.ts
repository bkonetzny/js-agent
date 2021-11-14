
import { Game } from "../game";
import { Instance } from "../objects/instance";

export abstract class ArrayStorage<T extends Instance> {
    public game: Game;
    public data: Array<T>;

    constructor(game: Game) {
        this.game = game;
        this.data = [];
    }

    add(item: T): T {
        if (!item.game) {
            item.setGame(this.game);
        }

        this.data.push(item);

        return item;
    }

    remove(item: T): boolean {
        const index = this.data.indexOf(item);

        if (index === -1) {
            return false;
        }

        this.data.splice(index, 1);

        return true;
    }

    removeAll(): boolean {
        this.data = [];

        return true;
    }

    findOneById(id: string): T | undefined {
        return this.data.find((item) => {
            return item.id === id;
        });
    }

    findAll(): T[] {
        return this.data;
    }
}
