let code = '';

const makeException = function (name) {

    code = `
    import { MessageTemplate, TranslatableMessage } from "../helpers/LocaleHelper";

    export abstract class ResponseException {
        Data: any;
        Status: number;
        Message: string;
    
        protected constructor(message: MessageTemplate, data?: any, ...args) {
            if (data == undefined) {
                data = null;
            }
            this.Data = data;
            this.Message = Reflect.construct(TranslatableMessage, [message].concat(args));
        }
    
        public GetMessage(): string {
            return this.Message;
        }
    
        public GetStatus(): number {
            return this.Status;
        }
    
        public GetPreparedResponse() {
            return {
                Message: this.Message
            };
        }
    }
    
    export class ForbiddenException extends ResponseException {
        Status = ResponseCode.FORBIDDEN;
    
        constructor(message?: MessageTemplate, ...args) {
            super(message || MessageTemplate.DefaultForbidden, null, ...args);
        }
    }
    
    export class UnAuthorizedException extends ResponseException {
        Status = ResponseCode.UNAUTHORIZED;
    
        constructor(message?: MessageTemplate, ...args) {
            super(message || MessageTemplate.DefaultUnAuthorized, null, ...args);
        }
    }
    
    export class NotFoundException extends ResponseException {
        Status = ResponseCode.NOT_FOUND;
    
        constructor(message?: MessageTemplate, ...args) {
            super(message || MessageTemplate.DefaultNotFound, null, ...args);
        }
    }
    
    export class FatalErrorException extends ResponseException {
        Status = ResponseCode.SERVER_ERROR;
    
        constructor(message?: MessageTemplate, ...args) {
            super(message || MessageTemplate.DefaultServerError, null, ...args);
        }
    }
    
    export class BadRequestException extends ResponseException {
        Status = ResponseCode.BAD_REQUEST;
    
        constructor(data?: any, message?: MessageTemplate, ...args) {
            super(message || MessageTemplate.DefaultBadRequest, data, ...args);
        }
    
        public GetPreparedResponse() {
            return {
                Message: this.Message,
                Errors: this.Data
            };
        }
    }
    
    export enum ResponseCode {
        OK = 200,
        SUCCESS_WITH_NO_CONTENT = 204,
        BAD_REQUEST = 400,
        UNAUTHORIZED = 401,
        FORBIDDEN = 403,
        NOT_FOUND = 404,
        SERVER_ERROR = 500
    }
    
    export enum ResponseMessage {
        UNAUTHORIZED = "Unauthorized for request. Token Mismatch.",
        SUCCESS = "Success",
        SUCCESS_WITH_NO_CONTENT = "No Content",
        FORBIDDEN = "Not allowed for performing this action.",
        BAD_REQUEST = "Bad Request. Please verify your request input.",
        SERVER_ERROR = "Internal Server Error",
        NOT_FOUND = "Resource Not found"
    }
    
    
` ;

    return code;

};

module.exports = makeException;

