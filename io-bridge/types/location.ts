import { Entity } from "./entity";
import { Resource } from "./resource";

export interface Location extends Entity {
    type: string;
    actions: Array<string>;
    resources: Array<Resource>;
}
