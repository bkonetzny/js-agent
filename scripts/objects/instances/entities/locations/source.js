// @ts-check

class SourceLocation extends LocationEntity {
    onCreate() {
        for (let index = 0; index < 10; index++) {
            let resource = new ItemA();
            resource.pickable = true;

            this.createResource(resource);
        }
    }

    onProcess() {
        if (this.processTicks < 10) {
            return;
        }

        if (this.getResources().length >= 20) {
            return;
        }

        let resource = new ItemA();
        resource.pickable = true;

        this.createResource(resource);

        this.resetProcessTicks();
    }
}
