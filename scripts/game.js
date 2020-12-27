// @ts-check

class Position {
    constructor(x, y) {
        this.x = parseInt(x, 10);
        this.y = parseInt(y, 10);
    }
}

class Entity {
    /**
     *
     * @param {Position} position
     */
    constructor(position) {
        this.position = position;
        this.processTicks = 0;
    }

    /**
     *
     * @param {Game} game
     */
    process(game) {
        this.processTicks++;
    }
}

class LocationEntity extends Entity {
    /**
     *
     * @param {Position} position
     * @param {String} type
     */
    constructor(position, type) {
        super(position);
        this.type = type;
    }

    /**
     *
     * @param {Game} game
     */
    process(game) {
        super.process(game);

        if (this.type !== 'destination' && this.type !== 'destination-busy') {
            return;
        }

        if (this.type === 'destination') {
            if (this.processTicks < 50) {
                return;
            }
        }
        else if (this.type === 'destination-busy') {
            if (this.processTicks < 10) {
                return;
            }
        }

        this.processTicks = 0;

        /**
         * @type {LocationEntity[]}
         */
        var possibleSources = game.locations.filter((location) => {
            return location.type === 'source';
        });

        if (!possibleSources.length) {
            return;
        }

        game.shuffleArray(possibleSources);

        var job = new Job(possibleSources.shift(), this);

        game.addJob(job);
    }
}

class AgentEntity extends Entity {
    /**
     *
     * @param {Position} position
     */
    constructor(position) {
        super(position);
        this.job = null;
    }

    /**
     *
     * @param {Game} game
     */
    process(game) {
        super.process(game);

        if (this.arrivedAtJobDestinationLocation()) {
            return;
        }

        this.arrivedAtJobSourceLocation();

        const jobTarget = this.job.getCurrentTargetLocation();
        this.moveToTarget(jobTarget);
    }

    /**
     *
     * @param {Job} job
     */
    setJob(job) {
        this.job = job;

        if (this.job.agent !== this) {
            this.job.setAgent(this);
        }
    }

    /**
     *
     * @param {LocationEntity} jobTarget
     */
    moveToTarget(jobTarget) {
        if (this.position.x > jobTarget.position.x) {
            this.position.x--;
        }
        if (this.position.x < jobTarget.position.x) {
            this.position.x++;
        }

        if (this.position.y > jobTarget.position.y) {
            this.position.y--;
        }
        if (this.position.y < jobTarget.position.y) {
            this.position.y++;
        }
    }

    /**
     *
     * @return {Boolean}
     */
    arrivedAtJobDestinationLocation() {
        if (!this.job || !this.job.started) {
            return false;
        }

        if (this.position.x === this.job.destination.position.x
            && this.position.y === this.job.destination.position.y
        ) {
            this.job.finished = true;
            this.job = null;

            return true;
        }

        return false;
    }

    /**
     *
     * @return {Boolean}
     */
    arrivedAtJobSourceLocation() {
        if (!this.job) {
            return false;
        }

        if (this.job.started) {
            return true;
        }

        if (this.position.x === this.job.source.position.x
            && this.position.y === this.job.source.position.y
        ) {
            this.job.started = true;
        }

        return this.job.started;
    }
}

class Job {
    /**
     *
     * @param {LocationEntity} source
     * @param {LocationEntity} destination
     */
    constructor(source, destination) {
        this.source = source;
        this.destination = destination;
        this.agent = null;
        this.started = false;
        this.finished = false;
    }

    /**
     *
     * @param {AgentEntity} agent
     */
    setAgent(agent) {
        this.agent = agent;

        if (this.agent.job !== this) {
            this.agent.setJob(this);
        }
    }

    /**
     *
     * @return {LocationEntity}
     */
    getCurrentTargetLocation() {
        return this.started ? this.destination : this.source;
    }
}

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
        this.render();

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
            this.shuffleArray(idleAgents);

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

    render() {
        if (!this.scene) {
            return;
        }

        this.scene.render(
            this.locations,
            this.agents,
            this.jobs
        );
    }

    forceRender() {
        if (this.running) {
            return;
        }

        this.render();
    }

    /**
     *
     * @param {Scene} scene
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

        this.forceRender();
    }

    /**
     *
     * @param {AgentEntity} agent
     */
    addAgent(agent) {
        this.agents.push(agent);

        this.forceRender();
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

    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }
}
