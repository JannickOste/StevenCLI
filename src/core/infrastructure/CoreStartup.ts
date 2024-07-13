import { Container, inject, injectable } from "inversify";
import IStartup from "../domain/IStartup";
import TYPES from "../../TYPES";
import "reflect-metadata"
import EventManager from "./managers/EventManager";

@injectable()
export default class CoreStartup implements IStartup 
{
    constructor(
        @inject(TYPES.container) private readonly container: Container
    ) {
        
    }

    async registerServices(): Promise<void> {
        this.container.bind<EventManager>(TYPES.Core.Events.IEventManager).to(EventManager);
    }

    async configureServices(): Promise<void> {
    }
}