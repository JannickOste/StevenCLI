import { injectable, multiInject } from "inversify";
import EventBus from "../events/EventBus";
import TYPES from "../../../TYPES";
import AAplicationEvent from "../../domain/events/AAplicationEvent";

@injectable()
export default class EventManager
{
    private readonly bus: EventBus;

    constructor(
        @multiInject(TYPES.Core.Events.IEvent) events: AAplicationEvent[]
    ) {
        this.bus = new EventBus(
            Array.isArray(events) ? events : [events]
        )
    }

    async emit(
        event: new(...args: any[]) => AAplicationEvent,
        ... payload: unknown[]
    ): Promise<void> {
        await this.bus.emit(
            event.name,
            ... payload
        )
    }

    emitSync(
        event: new(...args: any[]) => AAplicationEvent,
        ... payload: unknown[]
    ): void {
        this.bus.emitSync(
            event.name,
            ... payload
        );
    }
}
