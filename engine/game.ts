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

export class Game {
    public settings : any;
    public outputHandler ?: OutputHandler;
    public running : boolean;
    public locations : LocationRepository;
    public agents : AgentRepository;
    public jobs : JobRepository;
    public resources : ResourceRepository;
    public tickFunction : CallableFunction;

    constructor(settings: any, tickFunction: Function) {
        this.settings = {...{
            assignIdleAgentToOpenJobStrategy: 'closest', // next, random, closest
        }, ...settings};
        this.outputHandler = undefined;
        this.running = false;
        this.locations = new LocationRepository();
        this.agents = new AgentRepository();
        this.jobs = new JobRepository();
        this.resources = new ResourceRepository();
        this.tickFunction = tickFunction;
    }

    controlStart() {
        if (this.running) {
            return;
        }

        this.running = true;
        this.scheduleMainLoop();
    }

    controlPause() {
        if (!this.running) {
            return;
        }

        this.running = false;

        this.forcePublish();
    }

    mainLoop() {
        if (!this.running) {
            return;
        }

        this.process();
        this.publish();
        this.scheduleMainLoop();
    }

    scheduleMainLoop() {
        this.tickFunction(() => {
            this.mainLoop();
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

        this.outputHandler?.update(
            this.running,
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

    setOutputHandler(outputHandler: OutputHandler) {
        this.outputHandler = outputHandler;
    }

    command(command: string, data?: any) {
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

    addLocation(location: LocationEntity): string {
        location.setGame(this);
        this.locations.add(location);
        location.onCreate();

        this.forcePublish();

        return location.id;
    }

    addAgent(agent: AgentEntity): string {
        agent.setGame(this);
        this.agents.add(agent);

        this.forcePublish();

        return agent.id;
    }

    addJob(job: Job): string {
        job.setGame(this);
        this.jobs.add(job);

        return job.id;
    }

    updateSetting(key: string, value: string): object {
        let oldValue = this.settings[key];

        this.settings[key] = value;

        return {
            oldValue: oldValue,
            settings: this.settings,
        };
    }

    exportState(): string {
        this.controlPause();

        return JSON.stringify({
            settings: this.settings,
            locations: this.locations.findAll(),
            agents: this.agents.findAll(),
            jobs: this.jobs.findAll(),
            resources: this.resources.findAll(),
        });
    }

    importState(state: string): boolean {
        this.controlPause();

        const parsedState: object = JSON.parse(state);

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
