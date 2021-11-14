import { Position } from "./types/position";

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

class LocationActionInputCommand implements InputCommandInterface {
    command = 'location:action';
    data: any;

    constructor(locationId: string, action: string) {
        this.data = {
            id: locationId,
            action,
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
    LocationActionInputCommand,
}
