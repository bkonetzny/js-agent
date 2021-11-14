import { ItemA } from "../../resources/item-a";
import { LocationEntity } from "../location-entity";

export class SourceLocation extends LocationEntity {
    onCreate() {
        for (let index = 0; index < 10; index++) {
            const resource = new ItemA();
            resource.pickable = true;

            this.createResource(resource);
        }
    }

    onProcess() {
        if (this.processTicks < 50
            || this.getResources().length >= 20
        ) {
            return;
        }

        this.resetProcessTicks();

        const resource = new ItemA();
        resource.pickable = true;

        this.createResource(resource);
    }
}
