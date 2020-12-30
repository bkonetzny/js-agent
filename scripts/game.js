// @ts-check

class Game {
    constructor() {
        this.scene = null;
        this.running = false;
        this.locations = [];
        this.agents = [];
        this.jobs = [];
        this.timeout = 50;
    }

    controlStart() {
        console.log('game started');
        this.running = true;
        this.scheduleMainLoop();
    }

    controlPause() {
        console.log('game paused');
        this.running = false;
    }

    /**
     *
     * @param {Number} timestamp
     */
    mainLoop(timestamp) {
        if (!this.running) {
            return;
        }

        this.process();
        this.publish();

        setTimeout(() => {
            this.scheduleMainLoop();
        }, this.timeout);
    }

    scheduleMainLoop() {
        window.requestAnimationFrame((timestamp) => {
            this.mainLoop(timestamp);
        });
    }

    process() {
        LocationManager.process(this);
        JobManager.process(this);
        AgentManager.process(this);
    }

    publish() {
        if (!this.scene) {
            return;
        }

        this.scene.render(
            this.locations,
            this.agents,
            this.jobs
        );
    }

    forcePublish() {
        if (this.running) {
            return;
        }

        this.publish();
    }

    /**
     *
     * @param {UiScene} scene
     */
    setScene(scene) {
        this.scene = scene;
    }

    /**
     *
     * @param {LocationEntity} location
     * @return {String}
     */
    addLocation(location) {
        this.locations.push(location);

        this.forcePublish();

        return location.id;
    }

    /**
     *
     * @param {AgentEntity} agent
     * @return {String}
     */
    addAgent(agent) {
        this.agents.push(agent);

        this.forcePublish();

        return agent.id;
    }

    /**
     *
     * @param {Job} job
     * @return {String}
     */
    addJob(job) {
        this.jobs.push(job);

        return job.id;
    }

    /**
     *
     * @return {String}
     */
    exportState() {
        const state = {
            locations: this.locations,
            agents: this.agents,
            jobs: this.jobs,
        };

        return JSON.stringify(state);
    }

    /**
     *
     * @param {String} state
     * @return {Boolean}
     */
    importState(state) {
        this.controlPause();

        /**
         * @type {Object}
         */
        const parsedState = JSON.parse(state);

        this.locations = parsedState.locations;
        this.agents = parsedState.agents;
        this.jobs = parsedState.jobs;

        this.controlStart();

        return true;
    }
}
