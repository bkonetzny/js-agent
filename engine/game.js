// @ts-check

import { AgentManager } from "./managers/agent-manager";
import { JobManager } from "./managers/job-manager";
import { LocationManager } from "./managers/location-manager";
import { AgentEntity } from "./objects/instances/entities/agent-entity";
import { LocationEntity } from "./objects/instances/entities/location-entity";
import { Job } from "./objects/instances/job";
import { OutputHandler } from "./output-handler";
import { AgentRepository } from "./storage/agent-repository";
import { JobRepository } from "./storage/job-repository";
import { LocationRepository } from "./storage/location-repository";
import { ResourceRepository } from "./storage/resource-repository";
import { cloneDeep, cloneDeepWith } from 'lodash-es';

export class Game {
    constructor(settings) {
        this.settings = {...{
            assignIdleAgentToOpenJobStrategy: 'closest', // next, random, closest
        }, ...settings};
        this.outputHandler = null;
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

        //setTimeout(() => {
            this.scheduleMainLoop();
        //}, this.timeout);
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
        if (!this.outputHandler) {
            return;
        }

        this.outputHandler.update(
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
     * @param {OutputHandler} outputHandler
     */
    setOutputHandler(outputHandler) {
        this.outputHandler = outputHandler;
    }

    /**
     *
     * @param {String} command
     * @param {Object} data
     */
    command(command, data) {
        switch (command) {
            case 'control:start':
                return this.controlStart();

            case 'control:pause':
                return this.controlPause();

            case 'setting:update':
                return this.updateSetting(data.key, data.value);

            case 'gamestate:import':
                return this.importState(data.state);

            case 'gamestate:export':
                return this.exportState();

            case 'location:add':
                return this.addLocation(data);

            case 'agent:add':
                return this.addAgent(data);

            default:
                throw new Error(`Unknown command "${command}"`);
        }
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

        const filterGame = (value, index, object, stack) => {
            if (value instanceof Game) {
                return null;
            }

            return undefined;
        };

        const state = {
            settings: this.settings,
            locations: cloneDeepWith(this.locations.findAll(), filterGame),
            agents: cloneDeepWith(this.agents.findAll(), filterGame),
            jobs: cloneDeepWith(this.jobs.findAll(), filterGame),
            resources: cloneDeepWith(this.resources.findAll(), filterGame),
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
