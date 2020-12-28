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

    mainLoop(timestamp) {
        // console.log('state: ' + this.running + ', timestamp:' + timestamp);

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
        this.locations.forEach((location) => {
            location.process(this);
        });

        /**
         * @type {AgentEntity[]}
         */
        var idleAgents = this.agents.filter((agent) => {
            return !agent.job;
        });

        /**
         * @type {Job[]}
         */
        var idleJobs = this.jobs.filter((job) => {
            return !job.agent;
        });

        if (idleAgents.length && idleJobs.length) {
            Helper.shuffleArray(idleAgents);

            idleJobs.forEach((job) => {
                if (!idleAgents.length) {
                    return;
                }

                job.setAgent(idleAgents.shift());
            });
        }

        /**
         * @type {AgentEntity[]}
         */
        var busyAgents = this.agents.filter((agent) => {
            return !!agent.job;
        });

        busyAgents.forEach((agent) => {
            agent.process(this);
        });
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
     */
    addLocation(location) {
        this.locations.push(location);

        this.forcePublish();
    }

    /**
     *
     * @param {AgentEntity} agent
     */
    addAgent(agent) {
        this.agents.push(agent);

        this.forcePublish();
    }

    /**
     *
     * @param {Job} job
     */
    addJob(job) {
        this.jobs.push(job);
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
