import { Entity } from "./instances/entity";

export class Position {
    public x : integer;
    public y : integer;

    constructor(x: string, y: string) {
        this.x = parseInt(x, 10);
        this.y = parseInt(y, 10);
    }

    static findClosestEntity<T extends Entity>(position: Position, entities: T[]): T | undefined {
        let closestDistance: number;
        let closestEntity: T | undefined = undefined;

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
