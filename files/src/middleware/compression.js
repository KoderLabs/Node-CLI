let code = '';

const makeCompressionMiddleware = function (name) {

    code = `
    import { ExpressMiddlewareInterface, Middleware } from "routing-controllers";
    import { NextFunction, Request, Response } from "express";
    import * as Compression from "compression";
    
    @Middleware({ type: "before" })
    export class CompressionMiddleware implements ExpressMiddlewareInterface {
        public use: (req: Request, res: Response, next: NextFunction) => {} = Compression();
    }
    
    
` ;

    return code;

};

module.exports = makeCompressionMiddleware;

