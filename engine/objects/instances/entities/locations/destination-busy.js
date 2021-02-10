// @ts-check

import { DestinationLocation } from "./destination";

export class DestinationBusyLocation extends DestinationLocation {
    constructor(...args) {
        super(...args);

        this.procesAfterTicks = 10;
    }
}
