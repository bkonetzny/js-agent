import { Position } from "../engine/objects/position";

interface InputCommandInterface {
    readonly command: string;
    readonly data?: any;
}

class ControlStartInputCommand implements InputCommandInterface {
    command = 'control:start';
}

class ControlPauseInputCommand implements InputCommandInterface {
    command = 'control:pause';
}

class GamestateExportInputCommand implements InputCommandInterface {
    command = 'gamestate:export';
}

class GamestateImportInputCommand implements InputCommandInterface {
    command = 'gamestate:mport';
    data: any;

    constructor(state: any) {
        this.data = {
            state: JSON.stringify(state),
        };
    }
}

class LocationAddInputCommand implements InputCommandInterface {
    command = 'location:add';
    data: any;

    constructor(locationId: string, position: Position, checkOnly: boolean = false) {
        if (checkOnly) {
            this.command += ':check';
        }

        this.data = {
            id: locationId,
            position,
        };
    }
}

class AgentAddInputCommand implements InputCommandInterface {
    command = 'agent:add';
    data: any;

    constructor(position: Position) {
        this.data = {
            position,
        };
    }
}

export {
    InputCommandInterface,
    ControlStartInputCommand,
    ControlPauseInputCommand,
    GamestateExportInputCommand,
    GamestateImportInputCommand,
    LocationAddInputCommand,
    AgentAddInputCommand,
}