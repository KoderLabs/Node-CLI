let code = '';

const makeCorsMiddleware = function (name) {

    code = `
    import { ExpressMiddlewareInterface, Middleware } from "routing-controllers";
    import { NextFunction, Request, Response } from "express";
    import * as Cors from "cors";
    
    @Middleware({ type: "before" })
    export class CorsMiddleware implements ExpressMiddlewareInterface {
        public use: (req: Request, res: Response, next: NextFunction) => {} = Cors({
            credentials: true,
            origin: function(origin, callback) {
                callback(null, true); // Allowing all because widget will be displayed on many sites in future or we can deny it by checking db
            }
        });
    }
    
    
` ;

    return code;

};

module.exports = makeCorsMiddleware;

