// @ts-check

class ArrayStorage {
    constructor() {
        this.data = [];
    }

    /**
     *
     * @param {Instance} item
     */
    add(item) {
        this.data.push(item);
    }

    /**
     *
     * @param {Instance} item
     */
    remove(item) {
        let index = this.data.indexOf(item);

        if (index === -1) {
            return false;
        }

        this.data.splice(index, 1);

        return true;
    }

    /**
     *
     * @param {String} id
     * @return {Instance}
     */
    findOneById(id) {
        return this.data.find((item) => {
            return item.id === id;
        });
    }

    /**
     *
     * @return {Instance[]}
     */
    findAll() {
        return this.data;
    }
}
