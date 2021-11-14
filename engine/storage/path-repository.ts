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

        const newPath = new Path(source, destination);
        newPath.setGame(this.game);

        if (!newPath.calculateSteps()) {
            console.log('Failed to calculate steps for path', newPath.source, newPath.destination);

            return undefined;
        }

        this.add(newPath);

        return newPath;
    }
}
