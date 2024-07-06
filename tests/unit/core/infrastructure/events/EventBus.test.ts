import AAplicationEvent from "../../../../../src/core/domain/events/AAplicationEvent";
import EventBus from "../../../../../src/core/infrastructure/events/EventBus";

describe('EventBus', () => {

    describe('constructor', () => {
            it('should register events on construction', () => {
                const event1 = class EventA extends AAplicationEvent { async invoke(){}}
                const event2 = class EventB extends AAplicationEvent { async invoke(){}}
                const bus = new EventBus([new event1(), new event2()]);

                expect(bus.events).toEqual({
                    EventA: [new event1()],
                    EventB: [new event2()],
                });
            });
    });

    describe('emit', () => {
        it('should throw an error if the event isn\'t found', async () => {
            const bus = new EventBus();
        
            await expect(bus.emit('')).rejects.toThrow('Event not found...');
        });

        it('should emit events asynchronously', async () => {
            const event = new (class EventA extends AAplicationEvent { async invoke(){}})()
            const bus = new EventBus([event]);

            const invokeSpy = jest.spyOn(event, 'invoke');

            const payload = ['arg1', 'arg2'];
            await bus.emit('EventA', ...payload);

            expect(invokeSpy).toHaveBeenCalledTimes(1);
            expect(invokeSpy).toHaveBeenCalledWith(...payload);
        });
    });

    describe('emitSync', () => {
        it('should throw an error if the event isn\'t found', () => {
            const bus = new EventBus();
        
            expect(() => bus.emitSync('')).toThrow('Event not found...');
        });

        it('should emit events synchronously', () => {
            const event = new (class EventA extends AAplicationEvent { async invoke(){}})()
            const bus = new EventBus([event]);

            const invokeSpy = jest.spyOn(event, 'invoke');
            const payload = ['arg1', 'arg2'];
            bus.emitSync('EventA', ...payload);

            expect(invokeSpy).toHaveBeenCalledTimes(1);
            expect(invokeSpy).toHaveBeenCalledWith(...payload);
        });

        it('should handle multiple listeners for the same event', () => {
            const event1 = new (class EventA extends AAplicationEvent { async invoke(){}})()
            const event2 = new (class EventB extends AAplicationEvent { async invoke(){}})()
            const bus = new EventBus([]);
            bus.on("MyEvent", event1)
            bus.on("MyEvent", event2)
            
            const invokeSpyA = jest.spyOn(event1, 'invoke');
            const invokeSpyB = jest.spyOn(event2, 'invoke');
    
            const payload = ['arg1', 'arg2'];
            bus.emitSync('MyEvent', ...payload);

            expect(invokeSpyA).toHaveBeenCalledTimes(1);
            expect(invokeSpyA).toHaveBeenCalledWith(...payload);
            expect(invokeSpyB).toHaveBeenCalledTimes(1);
            expect(invokeSpyB).toHaveBeenCalledWith(...payload);
        });
    });

    describe('on', () => {
        it('should add a new event listener', () => {
            const event1 = new (class EventA extends AAplicationEvent { async invoke(){}})()
          const bus = new EventBus();
          bus.on('eventA', event1);
    
          expect(bus['events']['eventA']).toContain(event1);
        });
    
        it('should append a listener to an existing event', () => {
            const bus = new EventBus();
            const event1 = new (class EventA extends AAplicationEvent { async invoke(){}})()
            const event2 = new (class EventB extends AAplicationEvent { async invoke(){}})()

            bus.on('eventA', event1);
            bus.on('eventA', event2);
            
            expect(bus.events['eventA']).toContain(event1);
            expect(bus.events['eventA']).toContain(event2);
        });
    
        it('should create a new event array if event does not exist', () => {
            const bus = new EventBus();
            const event1 = new (class EventA extends AAplicationEvent { async invoke(){}})()

            bus.on('eventA', event1);
        
            expect(bus.events['eventA']).toEqual([event1]);
        });
    
        it('should not overwrite existing listeners when adding a new one', () => {
            const bus = new EventBus();
            const event1 = new (class EventA extends AAplicationEvent { async invoke(){}})()
            const event2 = new (class EventB extends AAplicationEvent { async invoke(){}})()

            bus.on('eventA', event1);
            bus.on('eventA', event2);
        
            expect(bus.events['eventA']).toHaveLength(2);
        });
      });
});