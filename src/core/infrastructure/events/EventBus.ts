import CoreApplicationError from "../../domain/errors/CoreApplicationError";
import AAplicationEvent from "../../domain/events/AAplicationEvent";
import delaySync from "../helpers/delaySync";


export default class EventBus{
    public readonly events: Record<string, AAplicationEvent[]> = {};

    constructor(
        events: AAplicationEvent[] = []
    ) {
        events.map(event => {
            this.on(
                event?.constructor.name,
                event
            );
        });

    }

    async emit(
        eventName: string,
        ...payload: unknown[]
    ) {
        const listeners = this.events[eventName] ?? [];
        if (listeners.length) {
            for (const listener of listeners) {
                await listener.invoke(
                    ...payload
                );
            }

            return;
        }

        throw new CoreApplicationError(`Event with name "${eventName}" not found...`);
    }

    emitSync(
        eventName: string, 
        ... payload: unknown[]
    ): void {

        const listeners = this.events[eventName] ?? [];
        if (listeners.length) {
            const listenerThreads = listeners.map(listeners => new Promise<void>((resolve, reject) => {
                listeners.invoke(...payload)
                    .then(outp => resolve(outp))
                    .catch(e => reject(e));
            }));

            while (!Promise.allSettled(listenerThreads)) {
                delaySync(50)
            }

            return;
        }


        throw new CoreApplicationError(`Event with name "${eventName}" not found...`);
    }

    on(
        eventName: string,
        listener: AAplicationEvent
    ) {
        if (!Object.keys(this.events).includes(eventName)) {
            this.events[eventName] = [];
        }

        this.events[eventName].push(listener);
    }
}
