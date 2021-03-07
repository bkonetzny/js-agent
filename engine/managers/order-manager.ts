import { Game } from "../game";
import { Job } from "../objects/instances/job";
import { Resource } from "../objects/instances/resource";

export class OrderManager {
    static process(game: Game) {
        game.orders.findAll().forEach((order) => {
            const location = order.getLocation();

            if (!location) {
                return;
            }

            order.forEachMissingResource((resourceClass, resourceDefinition): Resource | undefined => {
                const matchingResource = game.resources.findOneClosestByType(resourceDefinition.resource, location.position);

                if (!matchingResource) {
                    return undefined;
                }

                // @ts-ignore
                const job = new Job(matchingResource.getLocation(), location, matchingResource);

                matchingResource.assignToJob(job);

                game.addJob(job);

                return matchingResource;
            });

            if (order.isFulfilled()) {
                game.orders.remove(order);
            }
        });
    }
}
