let code = '';

const makeUserService = function (name) {

    code = `
    import { Service } from "typedi";
    import { UserRepository } from "../../repository/user/UserRepository";
    import { UserModel, UserModelStatus } from "../../model/user/UserModel";
    import {
        DeleteUserRequest,
        FindUserRequest,
        UpdateUserRequest,
        SignUpRequest,
        LoginRequest,
        ForgetPasswordUserRequest,
        ResettingForgetPasswordUserRequest
    } from "../../controller/user/UserRequest";
    import { ComparePassword, GetPaginationOptions, HashPassword, PaginationRequestParams } from "../../helpers/UtilHelper";
    import { ForbiddenException, NotFoundException, UnAuthorizedException } from "../../exception/ResponseException";
    import { AuthService } from "../AuthService";
    import { AuthenticationCodes, FORGET_PASSWORD_LINK } from "../../constant/AppConstant";
    import { MessageTemplate, Locale } from "../../helpers/LocaleHelper";
    import { EmailTemplate } from "../../templates/TemplateRenderer";
    import { SSMailer } from "../../helpers/MailHelper";
    
    @Service()
    export class UserService {
        constructor(private _userRepository: UserRepository, private _authService: AuthService) {}
    
        /**
         *
         * @param {number} data - SignUpRequest
         * @returns {Promise<{Token: string,Code:number}>}
         * @author Muhammad Daniyal
         */
        async SignUp(data: SignUpRequest): Promise<{ Token: string; Code: number }> {
            let User: UserModel;
            let Token;
            User = await this._userRepository.FindOne({
                Email: data.Email
            });
            if (User) {
                return {
                    Token: null,
                    Code: AuthenticationCodes.AlreadyRegistered
                };
            }
            User = new UserModel();
            User.FirstName = data.Name;
            User.Email = data.Email;
            User.Status = UserModelStatus.Unverified;
            User.Password = await HashPassword(data.Password);
            await this._userRepository.Save(User);
            Token = await this._authService.CreateSession(User.Id);
            return {
                Token: Token,
                Code: AuthenticationCodes.UserVerificationPending
            };
        }
    
        /**
         *
         * @param {number} data - LoginRequest
         * @returns {Promise<{Token: string,Code:number}>}
         * @author Muhammad Daniyal
         */
        async Login(data: LoginRequest): Promise<{ Token: string; Code: number }> {
            let User: UserModel;
    
            User = await this._userRepository.FindOne({
                Email: data.Email
            });
    
            if (User && (await ComparePassword(data.Password, User.Password)) === true) {
                let Token = await this._authService.CreateSession(User.Id);
                return {
                    Token: Token,
                    Code: AuthenticationCodes.UserLoginSuccess
                };
            }
            throw new UnAuthorizedException(MessageTemplate.InvalidCredentials);
        }
    
        /**
         *
         * @param {number} token - string
         * @returns {Promise<{ Message: string }>}
         * @author Muhammad Daniyal
         */
        async SignOut(token: string): Promise<{ Message: string }> {
            await this._authService.DestroySession(token);
            return {
                Message: "Success"
            };
        }
    
        /**
         *
         * @param {number} data - ForgetPasswordUserRequest
         * @returns {Promise<{ Message: string }>}
         * @author Muhammad Daniyal
         */
        async ForgetPassword(
            data: ForgetPasswordUserRequest
        ): Promise<{
            Message: string;
        }> {
            let User: UserModel;
    
            User = await this._userRepository.FindOne({
                Email: data.Email
            });
    
            if (!User) {
                throw new ForbiddenException(MessageTemplate.EmailNotRegistered);
            }
    
            let Link = FORGET_PASSWORD_LINK;
            await this._userRepository.Save(User);
            let EmailData = { Link: Link };
            SSMailer.SendByTemplate(EmailTemplate.ResetPassword, User.Email, Locale.En, EmailData);
            return {
                Message: "Success"
            };
        }
    
        /**
         *
         * @param {number} data - ResettingForgetPasswordUserRequest
         * @returns {Promise<{Token: string,Code:number}>}
         * @author Muhammad Daniyal
         */
        async ResettingForgetPassword(
            data: ResettingForgetPasswordUserRequest
        ): Promise<{
            Token: string;
            Code: number;
        }> {
            let User: UserModel;
    
            User = await this._userRepository.FindOne({
                Token: data.Token
            });
    
            if (!User) {
                return {
                    Token: null,
                    Code: AuthenticationCodes.InvalidToken
                };
            }
            User.Password = await HashPassword(data.Password);
            await this._userRepository.Save(User);
            let token = await this._authService.CreateSession(User.Id);
            return {
                Token: token,
                Code: AuthenticationCodes.UserLoginSuccess
            };
        }
    
        /**
         *
         * @param {number} data - UpdateUserRequest
         * @param {number} activeUser - UserModel
         * @returns {Promise<any>}
         * @author Muhammad Daniyal
         */
        async Update(data: UpdateUserRequest, activeUser: UserModel): Promise<any> {
            let User: UserModel = await this._userRepository.FindById(data.Id);
    
            if (!User) {
                throw new NotFoundException();
            }
    
            if (data.Id !== activeUser.Id) {
                throw new ForbiddenException();
            }
    
            if (data.Email) {
                let EmailUser: UserModel = await this._userRepository.FindOne({
                    Email: data.Email
                });
                if (EmailUser) {
                    throw new ForbiddenException(MessageTemplate.EmailAlreadyExists);
                }
                User.Email = data.Email;
            }
    
            if (data.FirstName) {
                User.FirstName = data.FirstName;
            }
            if (data.LastName) {
                User.LastName = data.LastName;
            }
            if (data.Password) {
                User.Password = await HashPassword(data.Password);
            }
    
            await this._userRepository.Save(User);
    
            return {
                Message: "Updated" // TODO: Discuss it to make consistent throughout the app
            };
        }
    
        /**
         *
         * @param {number} data - DeleteUserRequest
         * @param {number} activeUser - UserModel
         * @returns {Promise<any>}
         * @author Muhammad Daniyal
         */
        async Delete(data: DeleteUserRequest, activeUser: UserModel): Promise<any> {
            let User: UserModel = await this._userRepository.FindById(data.Id);
    
            if (!User) {
                throw new NotFoundException();
            }
    
            if (data.Id !== activeUser.Id) {
                throw new ForbiddenException();
            }
    
            await this._userRepository.DeleteById(User.Id);
    
            return {
                Message: "Deleted" // TODO: Discuss it to make consistent throughout the app
            };
        }
    
        /**
         *
         * @param {number} data - FindUserRequest
         * @returns {Promise<{Users: Array<UserModel}>}
         * @author Muhammad Daniyal
         */
        async Find(
            data: FindUserRequest
        ): Promise<{
            Users: Array<UserModel>;
        }> {
            let whereParams: any;
    
            if (data.Email) {
                whereParams.Email = data.Email;
            }
            if (data.Id) {
                whereParams.Id = data.Id;
            }
    
            return {
                Users: await this._userRepository.Find(whereParams, GetPaginationOptions(data as PaginationRequestParams))
            };
        }
    
        /**
         * @param {number} id - Id of the User
         * @returns {Promise<{User: UserModel}>}
         * @author Muhammad Daniyal
         */
        async Get(
            id: number
        ): Promise<{
            User: UserModel;
        }> {
            let User: UserModel = await this._userRepository.FindById(id);
            if (!User) {
                User = null;
            }
            return {
                User: User
            };
        }
    }
    
    
` ;

    return code;

};

module.exports = makeUserService;

