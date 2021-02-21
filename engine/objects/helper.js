// @ts-check

export class Helper {
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
