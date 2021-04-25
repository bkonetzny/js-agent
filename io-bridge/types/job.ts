import { Instance } from "./instance";
import { Location } from "./location";

export interface Job extends Instance {
    source: Location,
    destination: Location,
    resourceId: string,
    agentId: string,
    started: boolean,
    finished: boolean,
}
