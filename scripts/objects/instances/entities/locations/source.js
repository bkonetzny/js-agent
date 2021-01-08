// @ts-check

class SourceLocation extends LocationEntity {
    process() {
        super.process();

        if (this.processTicks < 50) {
            return;
        }

        this.resources.push(new ItemA());

        this.resetProcessTicks();
    }
}
