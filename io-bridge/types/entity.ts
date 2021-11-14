import { Instance } from "./instance";
import { Position } from "./position";

export interface Entity extends Instance {
    position: Position;
}
