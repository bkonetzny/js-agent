import { Position } from "../position";
import { AStarFinder, DiagonalMovement, Grid } from "pathfinding";
import { Terrain } from "../terrain";

export class Pathfinder {
    static findPath(source: Position, destination: Position, terrain: Terrain): Position[] {
        const matrix = terrain.getMatrix();
        const grid = new Grid(matrix);
        const finder = new AStarFinder({diagonalMovement: DiagonalMovement.Always});
        const path = finder.findPath(source.x, source.y, destination.x, destination.y, grid);

        return path.map((pathSegment: any) => {
            return new Position(pathSegment[0], pathSegment[1]);
        });
    }
}
