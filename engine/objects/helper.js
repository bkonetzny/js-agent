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
     * @returns {String}
     */
    static createUuid() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    /**
     *
     * @param {Array|Object} inObject
     * @param {String[]} ignoreKeys
     */
    static deepCopy(inObject, ignoreKeys) {
        let outObject, value, key;

        if (typeof inObject !== "object" || inObject === null) {
            return inObject;
        }

        // Create an array or object to hold the values
        outObject = Array.isArray(inObject) ? [] : {};

        for (key in inObject) {
            if (ignoreKeys.includes(key)) {
                continue;
            }

            value = inObject[key]

            outObject[key] = this.deepCopy(value, ignoreKeys);
        }

        return outObject
    }
}
