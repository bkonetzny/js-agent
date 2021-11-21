import { Position } from "../../../position";
import { AgentEntity } from "../agent-entity";
import { LocationEntity } from "../location-entity";

export class DepotLocation extends LocationEntity {
    onCreate() {
        for (let index = 0; index < 10; index++) {
            const position = new Position(this.position.x + index, this.position.y + index);
            const agent = new AgentEntity(position);

            this.game?.agents.add(agent);
        }

        this.game?.events.on('agent:arrived:'+this.id, (agent: AgentEntity) => {
            agent.chargeEnergy();
        }));
    }
}
