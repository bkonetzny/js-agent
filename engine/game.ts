import { cloneDeepWith } from 'lodash-es';
import { AgentManager } from "./managers/agent-manager";
import { JobManager } from "./managers/job-manager";
import { LocationManager } from "./managers/location-manager";
import { OrderManager } from "./managers/order-manager";
import { AgentEntity } from "./objects/instances/entities/agent-entity";
import { LocationEntity } from "./objects/instances/entities/location-entity";
import { Job } from "./objects/instances/job";
import { Order } from './objects/instances/order';
import { OutputHandler } from "./output-handler";
import { AgentRepository } from "./storage/agent-repository";
import { JobRepository } from "./storage/job-repository";
import { LocationRepository } from "./storage/location-repository";
import { OrdersRepository } from "./storage/orders-repository";
import { ResourceRepository } from "./storage/resource-repository";

export class Game {
    public settings : any;
    public outputHandler ?: OutputHandler;
    public running : boolean;
    public locations : LocationRepository;
    public agents : AgentRepository;
    public jobs : JobRepository;
    public resources : ResourceRepository;
    public orders : OrdersRepository;
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
        this.orders = new OrdersRepository();
        this.tickFunction = tickFunction;
    }

    controlStart() {
        if (this.running) {
            return;
        }

        console.log('game started');
        this.running = true;
        this.scheduleMainLoop();
    }

    controlPause() {
        if (!this.running) {
            return;
        }

        console.log('game paused');
        this.running = false;
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
        OrderManager.process(this);
        LocationManager.process(this);
        JobManager.process(this);
        AgentManager.process(this);
    }

    publish() {
        if (!this.outputHandler) {
            return;
        }

        this.outputHandler?.update(
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

    addOrder(order: Order): string {
        order.setGame(this);
        this.orders.add(order);

        return order.id;
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
