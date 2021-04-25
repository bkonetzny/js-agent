import { Instance } from "./instance";

export interface Resource extends Instance {
    owner: string;
    locationId?: string;
    jobId?: string;
    pickable: boolean;
}
