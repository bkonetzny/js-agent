// @ts-check

class DestinationBusyLocation extends DestinationLocation {
    constructor(...args) {
        super(...args);

        this.procesAfterTicks = 10;
    }
}
