let code = '';

const makeUserResponse = function (name) {

    code = `
    import { Length, IsDate, IsInt, Min, ValidateNested, IsEmail } from "class-validator";
    export class SignUpResponse {
        @Length(0, 255)
        Token: string;
    
        @IsInt()
        @Min(0)
        Code: number;
    }
    
    export class LoginResponse {
        @Length(0, 255)
        Token: string;
    
        @IsInt()
        @Min(0)
        Code: number;
    }
    
    export class OnFindUserModel {
        @IsDate()
        CreatedAt: Date;
    
        @IsInt()
        @Min(0)
        Id: number;
    
        @IsInt()
        @Min(0)
        AccountId: number;
    
        @Length(1, 255)
        FirstName: string;
    
        @Length(1, 255)
        LastName: string;
    
        @IsEmail()
        Email: string;
    
        @Length(1, 255)
        Status: string;
    }
    
    export class UpdateUserResponse {
        @Length(1, 255)
        Message: string;
    }
    
    export class DeleteUserResponse {
        @Length(1, 255)
        Message: string;
    }
    
    export class GetUserList {
        @ValidateNested({ each: true })
        Users: OnFindUserModel;
    }
    
    export class GetUser {
        @ValidateNested()
        User: OnFindUserModel;
    }
    
    export class VerifyUserResponse {
        @IsEmail()
        Email: string;
    }
    
` ;

    return code;

};

module.exports = makeUserResponse;

