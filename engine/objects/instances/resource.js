// @ts-nocheck

import { Instance } from "../instance";
import { LocationEntity } from "./entities/location-entity";
import { Job } from "./job";

export class Resource extends Instance {
    constructor() {
        super();
        this.owner = 'location'; // location, agent
        this.locationId = null;
        this.jobId = null;
        this.pickable = false;
    }

    /**
     *
     * @returns {LocationEntity|null}
     */
    getLocation() {
        return this.locationId
            ? this.game.locations.findOneById(this.locationId)
            : null;
    }

    /**
     *
     * @param {LocationEntity} location
     */
    assignToLocation(location) {
        this.locationId = location.id;
        this.owner = 'location';
        this.pickable = false;
    }

    /**
     *
     * @param {Job} job
     */
    assignToJob(job) {
        this.jobId = job.id;
        this.pickable = false;
    }

    assignToAgent() {
        this.owner = 'agent';
        this.pickable = false;
    }
}