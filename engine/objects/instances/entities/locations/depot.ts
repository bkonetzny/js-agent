import { AgentEntity } from "../agent-entity";
import { LocationEntity } from "../location-entity";

export class DepotLocation extends LocationEntity {
    onCreate() {
        for (let index = 0; index < 10; index++) {
            const agent = new AgentEntity(this.position);

            this.game?.agents.add(agent);
        }
    }
}
