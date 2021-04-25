import { Instance } from "./instance";
import { Location } from "./location";
import { Position } from "./position";

export interface Path extends Instance {
    source: Location,
    destination: Location,
    steps: Array<Position>,
}
