import { Path } from "../objects/instances/path";
import { Position } from "../objects/position";
import { ArrayStorage } from "./array-storage";

export class PathRepository extends ArrayStorage<Path> {
    findOneBySourceAndDestinationOrCreate(source: Position, destination: Position): Path | undefined {
        const path = this.data.find((path) => {
            return (
                Position.isSamePosition(path.source, source)
                && Position.isSamePosition(path.destination, destination)
            );
        });

        if (path) {
            return path;
        }

        const newPath = new Path(source, destination);

        this.add(newPath);

        return newPath;
    }
}
