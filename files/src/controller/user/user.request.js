let code = '';

const makeUserRequest = function (name) {

    code = `
    import { IsArray, IsEmail, IsInt, IsOptional, Length, Min } from "class-validator";
    import { Transform } from "class-transformer";
    
    export class LoginRequest {
        @IsEmail()
        Email: string;
    
        @Length(5, 255)
        Password: string;
    }
    
    export class SignUpRequest {
        @IsEmail()
        Email: string;
    
        @Length(5, 255)
        Password: string;
    
        @Length(1, 255)
        Name: string;
    }
    
    export class DeleteUserRequest {
        @IsInt()
        @Min(1)
        Id: number;
    }
    
    export class FindUserRequest {
        @IsOptional()
        Email: string;
    
        @IsOptional()
        Id: number;
    
        @IsOptional()
        Page: number;
    
        @IsOptional()
        Limit: number;
    
        @IsOptional()
        Before: number;
    
        @IsOptional()
        After: number;
    }
    
    export class UpdateUserRequest {
        @IsInt()
        @Min(0)
        Id: number;
    
        @IsOptional()
        @Length(1, 255)
        FirstName: string;
    
        @IsOptional()
        @Length(1, 255)
        LastName: string;
    
        @IsOptional()
        @IsEmail()
        Email: string;
    
        @IsOptional()
        @Length(1, 255)
        Password: string;
    
        @Transform(value => parseInt(value))
        @IsOptional()
        @IsInt()
        Status: number;
    }
    
    export class VerifyUserRequest {
        @Length(0, 255)
        Token: string;
    }
    
    export class ForgetPasswordUserRequest {
        @IsEmail()
        Email: string;
    }
    
    export class ResettingForgetPasswordUserRequest {
        @Length(1, 255)
        Token: string;
    
        @Length(5, 255)
        Password: string;
    }
    
` ;

    return code;

};

module.exports = makeUserRequest;

