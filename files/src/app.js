let code = '';

const makeAppJS = function (name) {

    code = `
    import "reflect-metadata";
    import * as express from "express";
    import * as lusca from "lusca";
    import * as cookieParser from "cookie-parser";
    import * as swaggerUI from "swagger-ui-express";
    import { SSLogger } from "./helpers/LoggerHelper";
    
    import { appEnv } from "./helpers/EnvHelper";
    // Load environment variables from .env file, where API keys and passwords are configured
    
    // Create Express server
    const app = express();
    
    app.use(express.json());
    app.use(express.static("public"));
    app.use(cookieParser());
    app.use(express.urlencoded({ extended: true }));
    app.use(lusca.xframe("SAMEORIGIN"));
    app.use(lusca.xssProtection(true));
    
    if (appEnv("DEBUG", false)) {
        app.use("/swagger", swaggerUI.serve, swaggerUI.setup(null, { swaggerUrl: "/swagger.json", explorer: true }));
    }
    
    SSLogger.InjectResponseLogger(app);
    
    module.exports = app;
    
` ;

    return code;

};

module.exports = makeAppJS;

