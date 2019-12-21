let code = '';

const makeIndexFile = function (name) {

    code = `
  
    import { CompressionMiddleware } from "./CompressionMiddleware";
import { ErrorHandlerMiddleware } from "./ErrorHandlerMiddleware";
import { LoggingMiddleware } from "./LoggingMiddleware";
import { CorsMiddleware } from "./CorsMiddleware";

export { CompressionMiddleware, LoggingMiddleware, ErrorHandlerMiddleware, CorsMiddleware };

` ;

    return code;

};

module.exports = makeIndexFile;

