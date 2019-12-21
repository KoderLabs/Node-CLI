let code = '';

const makeLoggerMiddleware = function (name) {

    code = `
    import { ExpressMiddlewareInterface, Middleware } from "routing-controllers";
    import { NextFunction, Request, Response } from "express";
    import { SSLogger } from "../helpers/LoggerHelper";
    
    @Middleware({ type: "after" })
    export class LoggingMiddleware implements ExpressMiddlewareInterface {
        public use: (req: Request, res: Response, next: NextFunction) => {} = SSLogger.GetLoggerMiddleware();
    }
    
    
` ;

    return code;

};

module.exports = makeLoggerMiddleware;

