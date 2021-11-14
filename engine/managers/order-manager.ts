import { Game } from "../game";
import { Job } from "../objects/instances/job";
import { Resource } from "../objects/instances/resource";

export class OrderManager {
    static process(game: Game) {
        game.orders.findAll().forEach((order) => {
            const destinationLocation = order.getLocation();

            if (!destinationLocation) {
                return;
            }

            order.forEachMissingResource((resourceClass, resourceDefinition): Resource | undefined => {
                const matchingResource = game.resources.findOneClosestByType(resourceDefinition.resource, destinationLocation.position);

                if (!matchingResource) {
                    return undefined;
                }

                const sourceLocation = matchingResource.getLocation();

                // @ts-ignore
                const job = new Job(sourceLocation, destinationLocation, matchingResource);

                matchingResource.assignToJob(job);

                game.jobs.add(job);

                return matchingResource;
            });

            if (order.isFulfilled()) {
                game.orders.remove(order);
            }
        });
    }
}
