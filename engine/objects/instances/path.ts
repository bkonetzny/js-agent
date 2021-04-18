import { Instance } from "../instance";
import { Position } from "../position";
import { Terrain } from "../terrain";
import { Pathfinder } from "../util/pathfinder";

export class Path extends Instance {
    public source : Position;
    public destination : Position;
    public steps : Array<Position>;

    constructor(source: Position, destination: Position, terrain: Terrain) {
        super();
        this.source = source;
        this.destination = destination;
        this.steps = [];
        this.calculateSteps(terrain);
    }

    calculateSteps(terrain: Terrain) {
        this.steps = Pathfinder.findPath(this.source, this.destination, terrain);
    }

    toJSON() {
        return {
            ...super.toJSON(),
            ...{
                source: this.source,
                destination: this.destination,
                steps: this.steps,
            }
        };
    }

    proceedOnPath(position: Position, speed: number): Position | undefined {
        const currentStepIndex = this.steps.findIndex((stepPosition) => {
            return Position.isSamePosition(stepPosition, position);
        });

        if (currentStepIndex === -1) {
            return undefined;
        }

        const newStepIndex = Math.min(currentStepIndex + speed, this.steps.length - 1);

        return this.steps[newStepIndex];
    }
}
