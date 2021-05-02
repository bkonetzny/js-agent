import { OutputHandler } from "../io-bridge/handlers";
import { InputCommandInterface } from "../io-bridge/input-commands";
import { AgentManager } from "./managers/agent-manager";
import { JobManager } from "./managers/job-manager";
import { LocationManager } from "./managers/location-manager";
import { OrderManager } from "./managers/order-manager";
import { PathManager } from "./managers/path-manager";
import { TerrainManager } from "./managers/terrain-manager";
import { AgentEntity } from "./objects/instances/entities/agent-entity";
import { Position } from "./objects/position";
import { Terrain } from "./objects/terrain";
import { LocationRegistry } from "./registries/location-registry";
import { AgentRepository } from "./storage/agent-repository";
import { JobRepository } from "./storage/job-repository";
import { LocationRepository } from "./storage/location-repository";
import { OrdersRepository } from "./storage/orders-repository";
import { PathRepository } from "./storage/path-repository";
import { ResourceRepository } from "./storage/resource-repository";

class Game {
    public settings: any;
    public outputHandler?: OutputHandler;
    public running: boolean;
    public locations: LocationRepository;
    public agents: AgentRepository;
    public jobs: JobRepository;
    public resources: ResourceRepository;
    public orders: OrdersRepository;
    public paths: PathRepository;
    public tickFunction: CallableFunction;
    public terrain: Terrain;

    constructor(settings: GameSettings, tickFunction: Function) {
        this.settings = {...{
            assignIdleAgentToOpenJobStrategy: 'closest', // next, random, closest
        }, ...settings};
        this.outputHandler = undefined;
        this.running = false;
        this.locations = new LocationRepository(this);
        this.agents = new AgentRepository(this);
        this.jobs = new JobRepository(this);
        this.resources = new ResourceRepository(this);
        this.orders = new OrdersRepository(this);
        this.paths = new PathRepository(this);
        this.tickFunction = tickFunction;
        this.terrain = TerrainManager.generate(this);
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
        PathManager.process(this);
    }

    publish() {
        if (!this.outputHandler) {
            return;
        }

        this.outputHandler?.update(JSON.parse(JSON.stringify({
            running: this.running,
            settings: {
                locations: LocationRegistry.getLocations(),
            },
            terrain: this.terrain,
            locations: this.locations.findAll(),
            agents: this.agents.findAll(),
            jobs: this.jobs.findAll(),
            resources: this.resources.findAll(),
            orders: this.orders.findAll(),
            paths: this.paths.findAll(),
        })));
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

            case 'location:action':
                return this.triggerLocationAction(inputCommand.data);

            case 'agent:add':
                return this.addAgent(inputCommand.data);

            default:
                throw new Error(`Unknown command "${inputCommand.command}"`);
        }
    }

    checkAddLocation(data: any): boolean | Error {
        const position: Position = data.position;

        return this.terrain.isPositionAvailable(position);
    }

    addLocation(data: any): string | Error {
        const check = this.checkAddLocation(data);
        if (check instanceof Error) {
            return check;
        }

        const position: Position = data.position;
        const location = LocationRegistry.createLocation(data.id, position);

        this.locations.add(location);
        location.onCreate();

        this.forcePublish();

        this.paths.removeAll();

        return location.id;
    }

    addAgent(data: any): string {
        const position: Position = data.position;
        const agent = new AgentEntity(position);

        this.agents.add(agent);

        this.forcePublish();

        return agent.id;
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

    triggerLocationAction(data: any): boolean | Error {
        const location = this.locations.findOneById(data.id);

        if (!location) {
            return new Error('Location not found.');
        }

        this.forcePublish();

        return location.handleAction(data.action, data);
    }
}

interface GameSettings {
    terrain: GameSettingsTerrain;
    assignIdleAgentToOpenJobStrategy ?: string
}

interface GameSettingsTerrain {
    x: number;
    y: number;
}

export {
    Game,
    GameSettings,
    GameSettingsTerrain,
}
