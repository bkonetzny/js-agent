import { Instance } from "../objects/instance";

export class ArrayStorage<T extends Instance> {
    public data : Array<T>;

    constructor() {
        this.data = [];
    }

    add(item: T) {
        this.data.push(item);
    }

    remove(item: T) {
        let index = this.data.indexOf(item);

        if (index === -1) {
            return false;
        }

        this.data.splice(index, 1);

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
