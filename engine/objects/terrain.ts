import { Position } from "./position";

export class Terrain {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    getMatrix(): Array<any> {
        const matrix: Array<Array<number>> = [];
        for (let indexY = 0; indexY < this.y; indexY++) {
            let rowX: Array<number> = [];

            for (let indexX = 0; indexX < this.x; indexX++) {
                rowX.push(0);
            }

            matrix.push(rowX);
        }

        return matrix;
    }

    isPositionAvailable(position: Position): boolean | Error {
        if (position.x > 210 && position.x < 240) {
            return new Error('INVALID_LOCATION');
        }

        return true;
    }
}
