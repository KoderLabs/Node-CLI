let code = '';

const makeUserController = function (name) {

    code = `
    import { Body, CurrentUser, JsonController, Authorized, Delete, Get, Post, Put, QueryParams, Param } from "routing-controllers";
import { UserService } from "../../service/user/UserService";
import { UserModel } from "../../model/user/UserModel";
import { DeleteUserRequest, FindUserRequest, UpdateUserRequest } from "./UserRequest";

@JsonController()
export class UserController {
    constructor(private _userService: UserService) { }

    /**
     *
     * User Listing
     * @CurrentUser provide online user details
     */
    @Authorized()
    @Get("/users")
    async Find(
        @QueryParams() data: FindUserRequest,
        @CurrentUser({ required: true }) user: UserModel
    ): Promise<{ Users: Array<UserModel> }> {
        return await this._userService.Find(data);
    }

    /**
     *
     * Get User by Id
     * @CurrentUser provide online user details
     */
    @Authorized()
    @Get("/user/:Id")
    async Get(@Param("Id") id: number, @CurrentUser({ required: true }) user: UserModel): Promise<{ User: UserModel }> {
        return await this._userService.Get(id);
    }

    /**
     *
     * Verify me
     * @CurrentUser provide online user details
     */
    @Authorized()
    @Get("/me")
    async Me(@CurrentUser({ required: true }) user: UserModel): Promise<{ User: UserModel }> {
        return {
            User: user
        };
    }

    /**
     *
     * Update User
     * @CurrentUser provide online user details
     */
    @Authorized()
    @Put("/user")
    async Update(@Body() userData: UpdateUserRequest, @CurrentUser({ required: true }) user: UserModel): Promise<any> {
        return await this._userService.Update(userData, user);
    }

    /**
     *
     * Delete User
     * @CurrentUser provide online user details
     */
    @Authorized()
    @Delete("/user")
    async Delete(@Body() userData: DeleteUserRequest, @CurrentUser({ required: true }) user: UserModel): Promise<any> {
        return await this._userService.Delete(userData, user);
    }
}

` ;

    return code;

};

module.exports = makeUserController;

