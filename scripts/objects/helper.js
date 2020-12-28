// @ts-check

class Helper {
    /**
     *
     * @param {Array} array
     */
    static shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    /**
     *
     * @return {String}
     */
    static createUuid() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
}
