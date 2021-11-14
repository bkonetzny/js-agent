import { LocationEntity } from "../objects/instances/entities/location-entity";
import { Order } from "../objects/instances/order";
import { ArrayStorage } from "./array-storage";

export class OrdersRepository extends ArrayStorage<Order> {
    findByLocation(location: LocationEntity): Order[] {
        return this.data.filter((order) => {
            return order.locationId === location.id;
        });
    }

    hasOpenOrderForLocation(location: LocationEntity, type: string): boolean {
        return this.data.findIndex((order) => {
            return (
                order.locationId === location.id
                && order.type === type
            );
        }) !== -1;
    }

    removeByLocation(location: LocationEntity): boolean {
        this.data.forEach((order) => {
            if (order.locationId === location.id) {
                console.log('removed order', order);
                this.remove(order);
            }
        });

        return true;
    }
}
