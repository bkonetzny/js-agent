// @ts-check

class Resource extends Instance {
    constructor() {
        super();
        this.owner = 'location'; // location, agent
        this.locationId = null;
        this.agentId = null;
    }
}