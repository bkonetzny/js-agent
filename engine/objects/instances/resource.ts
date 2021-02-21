// @ts-nocheck

import { Instance } from "../instance";
import { LocationEntity } from "./entities/location-entity";
import { Job } from "./job";

export class Resource extends Instance {
    public owner : string;
    public locationId ?: string;
    public jobId ?: string;
    public pickable : boolean;

    constructor() {
        super();
        this.owner = 'location'; // location, agent
        this.locationId = undefined;
        this.jobId = undefined;
        this.pickable = false;
    }

    getLocation(): LocationEntity | null {
        return this.locationId
            ? this.game.locations.findOneById(this.locationId)
            : null;
    }

    assignToLocation(location: LocationEntity) {
        this.locationId = location.id;
        this.owner = 'location';
        this.pickable = false;
    }

    assignToJob(job: Job) {
        this.jobId = job.id;
        this.pickable = false;
    }

    assignToAgent() {
        this.owner = 'agent';
        this.pickable = false;
    }
}