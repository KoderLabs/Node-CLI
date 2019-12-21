let code = '';

const makeServerJS = function (name) {

    code = `
    import * as dotenv from "dotenv";
    dotenv.config();
    import * as errorHandler from "errorhandler";
    import Bootstrap from "./bootstrap/Bootstrap";
    import { appEnv } from "./helpers/EnvHelper";
    import * as http from "http";
    import { SSLogger } from "./helpers/LoggerHelper";
    
    const app = require("./App");
    
    /**
     * Error Handler. Provides full stack - remove for production
     */
    app.use(errorHandler());
    
    /** Start Express server. */
    const server = http.createServer(app);
    server.listen(appEnv("APP_PORT", 3000), async () => {
        SSLogger.Info(\`App is running at http://localhost:\${appEnv("APP_PORT", 3000)} in \${app.get("env")} mode\`);
    });
    Bootstrap.boot(app, server).then(() => {});
    
` ;

    return code;

};

module.exports = makeServerJS;

