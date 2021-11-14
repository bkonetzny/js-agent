import { Entity } from "./entity";
import { Job } from "./job";

export interface Agent extends Entity {
    job?: Job;
}
