import { InputCommandInterface } from "../io-bridge/input-commands";
import { OutputHandler } from "../io-bridge/handlers";
import { AgentManager } from "./managers/agent-manager";
import { JobManager } from "./managers/job-manager";
import { LocationManager } from "./managers/location-manager";
import { OrderManager } from "./managers/order-manager";
import { AgentEntity } from "./objects/instances/entities/agent-entity";
import { Job } from "./objects/instances/job";
import { Order } from './objects/instances/order';
import { Position } from "./objects/position";
import { LocationRegistry } from "./registries/location-registry";
import { AgentRepository } from "./storage/agent-repository";
import { JobRepository } from "./storage/job-repository";
import { LocationRepository } from "./storage/location-repository";
import { OrdersRepository } from "./storage/orders-repository";
import { ResourceRepository } from "./storage/resource-repository";

export class Game {
    public settings: any;
    public outputHandler?: OutputHandler;
    public running: boolean;
    public locations: LocationRepository;
    public agents: AgentRepository;
    public jobs: JobRepository;
    public resources: ResourceRepository;
    public orders: OrdersRepository;
    public tickFunction: CallableFunction;

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
            this.running,
            {
                locations: LocationRegistry.getLocations(),
            },
            this.locations.findAll(),
            this.agents.findAll(),
            this.jobs.findAll(),
            this.resources.findAll(),
            this.orders.findAll()
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
        this.forcePublish();
    }

    command(inputCommand: InputCommandInterface) {
        switch (inputCommand.command) {
            case 'control:start':
                return this.controlStart();

            case 'control:pause':
                return this.controlPause();

            case 'setting:update':
                return this.updateSetting(inputCommand.data.key, inputCommand.data.value);

            case 'gamestate:import':
                return this.importState(inputCommand.data.state);

            case 'gamestate:export':
                return this.exportState();

            case 'location:add:check':
                return this.checkAddLocation(inputCommand.data);

            case 'location:add':
                return this.addLocation(inputCommand.data);

            case 'agent:add':
                return this.addAgent(inputCommand.data);

            default:
                throw new Error(`Unknown command "${inputCommand.command}"`);
        }
    }

    checkAddLocation(data: any): boolean | Error {
        const position: Position = data.position;

        if (position.x > 210 && position.x < 240) {
            return new Error('INVALID_LOCATION');
        }

        return true;
    }

    addLocation(data: any): string | Error {
        const check = this.checkAddLocation(data);
        if (check instanceof Error) {
            return check;
        }

        const position: Position = data.position;
        const location = LocationRegistry.createLocation(data.id, position);

        location.setGame(this);
        this.locations.add(location);
        location.onCreate();

        this.forcePublish();

        return location.id;
    }

    addAgent(data: any): string {
        const position: Position = data.position;
        const agent = new AgentEntity(position);

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

        return JSON.stringify({
            settings: this.settings,
            locations: this.locations.findAll(),
            agents: this.agents.findAll(),
            jobs: this.jobs.findAll(),
            resources: this.resources.findAll(),
            orders: this.orders.findAll(),
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
