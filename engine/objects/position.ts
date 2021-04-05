import { Entity } from "./instances/entity";

export class Position {
    public x : number;
    public y : number;

    constructor(x: string | number, y: string | number) {
        // @ts-ignore
        this.x = parseInt(x, 10);
        // @ts-ignore
        this.y = parseInt(y, 10);
    }

    static findClosestEntity<T extends Entity>(position: Position, entities: T[]): T | undefined {
        let closestDistance: number;
        let closestEntity: T | undefined = undefined;

        entities.forEach((entity) => {
            const distance = this.getDistance(position.x, entity.position.x) + this.getDistance(position.y, entity.position.y);

            if (!closestEntity || distance < closestDistance) {
                closestEntity = entity;
                closestDistance = distance;
            }
        });

        return closestEntity;
    }

    static isSamePosition(source: Position, destination: Position): boolean {
        return (
            source.x === destination.x
            && source.y === destination.y
        );
    }

    static getDistance(source: number, destination: number): number {
        return Math.abs(source - destination);
    }
}
