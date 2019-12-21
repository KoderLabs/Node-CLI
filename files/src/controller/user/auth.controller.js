let code = '';

const makeAuthController = function (name) {

    code = `
    import { Body, CurrentUser, JsonController, Req, Authorized, Get, Post, Put } from "routing-controllers";
    import { LoginRequest, SignUpRequest, ForgetPasswordUserRequest, ResettingForgetPasswordUserRequest } from "./UserRequest";
    import { LoginResponse, SignUpResponse } from "./UserResponse";
    import { AUTHORIZATION_HEADER_KEY } from "../../constant/AppConstant";
    import { MessageResponse } from "../../response";
    import { UserModel } from "../../model/user/UserModel";
    import { UserService } from "../../service/user/UserService";
    
    @JsonController()
    export class AuthController {
        constructor(private _userService: UserService) { }
    
        /**
         * Health Check
         */
        @Get("/")
        Greet() {
            return {
                App: "App-Server",
                Version: "0.0.1"
            };
        }
    
        /**
         *
         * SignUp User
         */
        @Post("/signup")
        async SignUp(@Body() signUpData: SignUpRequest) {
            return await this._userService.SignUp(signUpData);
        }
    
        /**
         *
         * Login User
         */
        @Post("/login")
        async LogIn(@Body() loginData: LoginRequest) {
            return await this._userService.Login(loginData);
        }
    
        /**
         * Forget Password
         */
        @Post("/auth/password/forgot")
        async ForgetPassword(
            @Body() userData: ForgetPasswordUserRequest
        ): Promise<{
            Message: string;
        }> {
            return await this._userService.ForgetPassword(userData);
        }
    
        /**
         * Reset Password
         */
        @Put("/auth/password/reset")
        async ResettingForgetPassword(
            @Body() userData: ResettingForgetPasswordUserRequest
        ): Promise<{
            Token: string;
        }> {
            return await this._userService.ResettingForgetPassword(userData);
        }
    
        /**
         * SignOut
         */
        @Authorized()
        @Post("/signout")
        async SignOut(@CurrentUser({ required: true }) user: UserModel, @Req() req) {
            return await this._userService.SignOut(req.headers[AUTHORIZATION_HEADER_KEY]);
        }
    }
        
    
` ;

    return code;

};

module.exports = makeAuthController;

