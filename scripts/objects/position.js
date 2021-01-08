// @ts-check

class Position {
    /**
     *
     * @param {Number} x
     * @param {Number} y
     */
    constructor(x, y) {
        this.x = parseInt(x, 10);
        this.y = parseInt(y, 10);
    }

    /**
     *
     * @param {Position} position
     * @param {Entity[]} entities
     * @return {Entity|null}
     */
    static findClosestEntity(position, entities) {
        let closestDistance;
        let closestEntity;

        entities.forEach((entity) => {
            let distance = Math.abs(position.x - entity.position.x) + Math.abs(position.y - entity.position.y);

            if (!closestEntity || distance < closestDistance) {
                closestEntity = entity;
                closestDistance = distance;
            }
        });

        return closestEntity;
    }
}
