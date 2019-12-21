let code = '';

const makeErrorMiddleware = function (name) {

    code = `
    import {
        BadRequestError,
        ExpressErrorMiddlewareInterface,
        Middleware,
        NotFoundError,
        UnauthorizedError
    } from "routing-controllers";
    import * as Express from "express";
    import {
        BadRequestException,
        FatalErrorException,
        NotFoundException,
        ResponseException,
        UnAuthorizedException
    } from "../exception/ResponseException";
    import { KeyValuePair } from "../database/DatabaseLoader";
    import { SSLogger } from "../helpers/LoggerHelper";
    import { LocaleInterceptor } from "../interceptor/LocaleInterceptor";
    import { MessageTemplate } from "../helpers/LocaleHelper";
    
    @Middleware({ type: "after" })
    export class ErrorHandlerMiddleware implements ExpressErrorMiddlewareInterface {
        public error(error: any, req: Express.Request, res: Express.Response, next: Express.NextFunction) {
            if (error instanceof BadRequestError) {
                error = new BadRequestException(this._prepareBadRequestErrors(error));
            } else if (error instanceof UnauthorizedError) {
                error = new UnAuthorizedException(MessageTemplate.DefaultUnAuthorized);
            } else if (error instanceof NotFoundError) {
                error = new NotFoundException(MessageTemplate.DefaultNotFound);
            } else if (!(error instanceof ResponseException)) {
                SSLogger.Fatal(error);
                error = new FatalErrorException();
            }
            if (error instanceof ResponseException) {
                res.status(error.GetStatus());
                res.json(LocaleInterceptor.Replace(error.GetPreparedResponse(), req));
            } else if (!error) {
                next();
            }
        }
    
        private _prepareBadRequestErrors(error: any): KeyValuePair<Array<string>> {
            let errors: KeyValuePair<Array<string>> = {};
    
            let func = function(err) {
                if (err.property && err.constraints) {
                    let constraints: Array<string> = [];
    
                    for (let constraint in err.constraints) {
                        constraints.push(constraint);
                    }
                    errors[err.property] = constraints;
                } else if (Array.isArray(err.children) && err.children.length > 0) {
                    for (let child of err.children) {
                        func(child);
                    }
                }
            };
            if (error && error.errors && Array.isArray(error.errors)) {
                for (let err of error.errors) {
                    func(err);
                }
            }
            return errors;
        }
    }
    
    
` ;

    return code;

};

module.exports = makeErrorMiddleware;

