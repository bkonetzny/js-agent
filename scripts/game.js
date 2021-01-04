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
            this.jobs.findAll()
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
     * @return {String}
     */
    addLocation(location) {
        location.setGame(this);
        this.locations.add(location);

        this.forcePublish();

        return location.id;
    }

    /**
     *
     * @param {AgentEntity} agent
     * @return {String}
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
     * @return {String}
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
     * @return {Object}
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
     * @return {String}
     */
    exportState() {
        this.controlPause();

        const state = {
            settings: this.settings,
            locations: Helper.deepCopy(this.locations.findAll(), ['game']),
            agents: Helper.deepCopy(this.agents.findAll(), ['game']),
            jobs: Helper.deepCopy(this.jobs.findAll(), ['game']),
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

        console.log('TODO: importState', parsedState);

        /*
        this.settings = parsedState.settings;
        this.locations = parsedState.locations;
        this.agents = parsedState.agents;
        this.jobs = parsedState.jobs;
        */

        this.controlStart();

        return true;
    }
}
