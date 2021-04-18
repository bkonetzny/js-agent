import { Path } from "../objects/instances/path";
import { Position } from "../objects/position";
import { ArrayStorage } from "./array-storage";

export class PathRepository extends ArrayStorage<Path> {
    findOneBySourceAndDestinationOrCreate(source: Position, destination: Position): Path | undefined {
        const matchedPath = this.data.find((path) => {
            return (
                Position.isSamePosition(path.source, source)
                && Position.isSamePosition(path.destination, destination)
            );
        });

        if (matchedPath) {
            return matchedPath;
        }

        const newPath = new Path(source, destination, this.game.terrain);
        newPath.setGame(this.game);

        this.add(newPath);

        return newPath;
    }
}
