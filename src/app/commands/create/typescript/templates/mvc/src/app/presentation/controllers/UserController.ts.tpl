import { controller, httpGet, interfaces, HttpResponseMessage, JsonContent } from "inversify-express-utils";
import { inject } from "inversify/lib/annotation/inject";
import APP_TYPES from "../../APP_TYPES";
import UserService from "../../infrastructure/services/UserService";

@controller("/user")
export default class UserController implements interfaces.Controller
{
    constructor( 
        @inject(APP_TYPES.services.IUserService) private userService: UserService
     ) {}

    
    @httpGet("/")
    private async list(): Promise<HttpResponseMessage> {
        const response = new HttpResponseMessage(200);
        response.content = new JsonContent(await this.userService.list())

        return response;
    }
}