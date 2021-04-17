import { Position } from "./position";

export class Terrain {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    isPositionAvailable(position: Position): boolean | Error {
        if (position.x > 210 && position.x < 240) {
            return new Error('INVALID_LOCATION');
        }

        return true;
    }
}
