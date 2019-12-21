let code = '';

const makeResponseCommon = function (name) {

    code = `
    import { IsInt, Length, Min, ValidateNested } from "class-validator";

    export class ValidationErrors {
        @Length(1, 255)
        "*": string;
    }
    
    export class BadRequestResponse {
        @Length(1, 255)
        Message: string;
    
        @ValidateNested()
        Errors: ValidationErrors;
    }
    
    export class MessageResponse {
        @Length(1, 255)
        Message: string;
    }
    
    export class MessageWithIdResponse {
        @IsInt()
        @Min(0)
        Id: string | number;
    
        @Length(1, 255)
        Message: string;
    
        constructor(id: number | string, message: string) {
            this.Message = message;
            this.Id = id;
        }
    }
    ` ;

    return code;

};

module.exports = makeResponseCommon;

