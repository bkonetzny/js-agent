// @ts-check

import { Entity } from "./instances/entity";

export class Position {
    /**
     *
     * @param {String} x
     * @param {String} y
     */
    constructor(x, y) {
        this.x = parseInt(x, 10);
        this.y = parseInt(y, 10);
    }

    /**
     *
     * @param {Position} position
     * @param {Entity[]} entities
     * @returns {Entity|undefined}
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
