// @ts-check

class Game {
    constructor(settings) {
        this.settings = {...{
            assignIdleAgentToOpenJobStrategy: 'closest', // next, random, closest
        }, ...settings};
        this.ui = null;
        this.running = false;
        this.locations = new LocationRepository();
        this.agents = new AgentRepository();
        this.jobs = new JobRepository();
        this.resources = new ResourceRepository();
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
        if (!this.ui) {
            return;
        }

        this.ui.publish(
            this.locations.findAll(),
            this.agents.findAll(),
            this.jobs.findAll(),
            this.resources.findAll()
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
     * @param {Ui} ui
     */
    setUi(ui) {
        this.ui = ui;
    }

    /**
     *
     * @param {LocationEntity} location
     * @returns {String}
     */
    addLocation(location) {
        location.setGame(this);
        this.locations.add(location);
        location.onCreate();

        this.forcePublish();

        return location.id;
    }

    /**
     *
     * @param {AgentEntity} agent
     * @returns {String}
     */
    addAgent(agent) {
        agent.setGame(this);
        this.agents.add(agent);

        this.forcePublish();

        return agent.id;
    }

    /**
     *
     * @param {Job} job
     * @returns {String}
     */
    addJob(job) {
        job.setGame(this);
        this.jobs.add(job);

        return job.id;
    }

    /**
     *
     * @param {String} key
     * @param {String} value
     * @returns {Object}
     */
    updateSetting(key, value) {
        let oldValue = this.settings[key];

        this.settings[key] = value;

        return {
            oldValue: oldValue,
            settings: this.settings,
        };
    }

    /**
     *
     * @returns {String}
     */
    exportState() {
        this.controlPause();

        const state = {
            settings: this.settings,
            locations: Helper.deepCopy(this.locations.findAll(), ['game']),
            agents: Helper.deepCopy(this.agents.findAll(), ['game']),
            jobs: Helper.deepCopy(this.jobs.findAll(), ['game']),
            resources: Helper.deepCopy(this.resources.findAll(), ['game']),
        };

        return JSON.stringify(state);
    }

    /**
     *
     * @param {String} state
     * @returns {Boolean}
     */
    importState(state) {
        this.controlPause();

        /**
         * @type {Object}
         */
        const parsedState = JSON.parse(state);

        console.log('TODO: importState', parsedState);

        /*
        this.settings = parsedState.settings;
        this.locations = parsedState.locations;
        this.agents = parsedState.agents;
        this.jobs = parsedState.jobs;
        this.resources = parsedState.resources;
        */

        this.controlStart();

        return true;
    }
}
