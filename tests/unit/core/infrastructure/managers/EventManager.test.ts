import AAplicationEvent from "../../../../../src/core/domain/events/AAplicationEvent";
import EventBus from "../../../../../src/core/infrastructure/events/EventBus";
import EventManager from "../../../../../src/core/infrastructure/managers/EventManager";

jest.mock( "../../../../../src/core/infrastructure/events/EventBus");
jest.mock("../../../../../src/core/domain/events/AAplicationEvent");

class EventMock extends AAplicationEvent {
    public async invoke(...args: unknown[]): Promise<void> {
        return;
    }
}

describe("EventManager", () => {
    let eventBusMock: jest.Mocked<EventBus>;
    let mockEvent: AAplicationEvent;

    beforeEach(() => {
        eventBusMock = new EventBus([]) as jest.Mocked<EventBus>;
        mockEvent = new EventMock() as jest.Mocked<AAplicationEvent>;

        EventBus.prototype.emit = jest.fn();
        EventBus.prototype.emitSync = jest.fn();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("emit", () => {
        it("should emit an event successfully", async () => {
            eventBusMock.emit.mockResolvedValueOnce();
            const manager = new EventManager([mockEvent]);
            const emitSpy = jest.spyOn(manager, "emit")

            const result = await manager.emit(mockEvent.constructor as new() => AAplicationEvent);

            expect(emitSpy).toHaveBeenCalledWith(mockEvent.constructor);
            expect(result).toBeUndefined();
        });
    });

    describe("emitSync", () => {
        it("should emit an event synchronously successfully", () => {
            eventBusMock.emitSync.mockImplementationOnce(() => {});
            const manager = new EventManager([mockEvent]);

            const emitSpy = jest.spyOn(manager, "emitSync")
            manager.emitSync(EventMock);

            expect(emitSpy).toHaveBeenCalledWith(EventMock);
        });
    });
});
