import { Position } from "../position";

export class Pathfinder {
    static proceedToPosition(source: Position, destination: Position, speed: number): Position {
        const x = this.proceedTowardsAxisValue(source.x, destination.x, speed);
        const y = this.proceedTowardsAxisValue(source.y, destination.y, speed);

        return new Position(x, y);
    }

    private static proceedTowardsAxisValue(source: number, destination: number, speed: number): number {
        const distance = Position.getDistance(source, destination);

        if (source > destination) {
            return source - Math.min(distance, speed);
        } else if (source < destination) {
            return source + Math.min(distance, speed);
        } else {
            return source;
        }
    }
}
