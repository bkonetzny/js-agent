import { Agent } from "./types/agent";
import { Job } from "./types/job";
import { Location } from "./types/location";
import { Order } from "./types/order";
import { Path } from "./types/path";
import { Resource } from "./types/resource";
import { Terrain } from "./types/terrain";

interface OutputStateInterface {
    readonly running: boolean;
    readonly settings: Object;
    readonly terrain: Terrain;
    readonly locations: Array<Location>;
    readonly agents: Array<Agent>;
    readonly jobs: Array<Job>;
    readonly resources: Array<Resource>;
    readonly orders: Array<Order>;
    readonly paths: Array<Path>;
}

export {
    OutputStateInterface,
}
