let code = '';

const makeLoggerHelper = function () {

    code = `
    import { Express, Request, Response } from "express";
    import { AUTHORIZATION_HEADER_KEY, JSON_LOG_INDENTATION, LogLevel } from "../constant/AppConstant";
    import { default as Chalk } from "chalk";
    import { Logger as IQueryLogger } from "typeorm";
    import { QueryRunner } from "typeorm/query-runner/QueryRunner";
    import { appEnv } from "./EnvHelper";
    import * as Morgan from "morgan";
    import { highlight } from "cli-highlight";
    
    export class SSLogger {
        public static InjectResponseLogger(app: Express): void {
            if (appEnv("DEBUG", false)) {
                let originalSend = app.response.send;
                app.response.send = function sendOverWrite(body) {
                    this.__ss_response_body = body;
                    return originalSend.call(this, body) as Response;
                };
            }
        }
    
        private static LoggerMiddleware: (req, res, next) => {} = null;
    
        private static QueryLogger: IQueryLogger = null;
    
        private static LoggingTemplates: {
            [key: number]: (...args) => {};
        } = null;
    
        private constructor() {}
    
        public static GetLoggerMiddleware(): (req, res, next) => {} {
            if (this.LoggerMiddleware === null) {
                let LoggerFormatStr =
                    ":remote-addr - :remote-user [:date[clf]] :method :url HTTP/:http-version :status :referrer :user-agent";
    
                if (appEnv("DEBUG", false)) {
                    Morgan.token(
                        "authorization",
                        (req: Request, res: Response): string => {
                            return req.headers[AUTHORIZATION_HEADER_KEY] as string;
                        }
                    );
    
                    Morgan.token(
                        "body",
                        (req: Request, res: Response): string => {
                            return req.body
                                ? highlight(JSON.stringify(req.body, null, JSON_LOG_INDENTATION), { language: "json" })
                                : "";
                        }
                    );
    
                    Morgan.token(
                        "query",
                        (req: Request, res: Response): string => {
                            return req.query
                                ? highlight(JSON.stringify(req.query, null, JSON_LOG_INDENTATION), { language: "json" })
                                : "";
                        }
                    );
    
                    Morgan.token(
                        "params",
                        (req: Request, res: Response): string => {
                            return req.params
                                ? highlight(JSON.stringify(req.params, null, JSON_LOG_INDENTATION), { language: "json" })
                                : "";
                        }
                    );
    
                    Morgan.token(
                        "responsebody",
                        (req: Request, res: Response): string => {
                            let str = "";
    
                            if ((res as any).__ss_response_body) {
                                try {
                                    // to avoid runtime exception for not json response
                                    str = highlight(
                                        JSON.stringify(JSON.parse((res as any).__ss_response_body), null, JSON_LOG_INDENTATION),
                                        {
                                            language: "JSON"
                                        }
                                    );
                                } catch (e) {
                                    str = (res as any).__ss_response_body;
                                }
                            }
                            return str;
                        }
                    );
                    LoggerFormatStr =
                        ":method :url :authorization :status :res[content-length] - :response-time ms\\nPath Params :params\\nQuery Params :query\\nRequest Body :body\\nResponse Body :responsebody";
                }
    
                this.LoggerMiddleware = Morgan(LoggerFormatStr, {
                    stream: {
                        write: str => {
                            this.Info(str);
                        }
                    }
                });
            }
            return this.LoggerMiddleware;
        }
    
        public static GetQueryLogger(): IQueryLogger {
            if (this.QueryLogger === null) {
                let LogSqlQuery = (query, parameters) => {
                    this.Trace(highlight(query, { language: "sql" }), "Query");
                    if (parameters) {
                        this.Trace(highlight(JSON.stringify(parameters, null, JSON_LOG_INDENTATION), { language: "json" }), "Params");
                    }
                };
    
                let Logger: IQueryLogger = {
                    log: (level: "log" | "info" | "warn", message: any, queryRunner?: QueryRunner) => {
                        switch (level) {
                            case "log":
                                this.Debug(message);
                                break;
                            case "info":
                                this.Info(message);
                                break;
                            case "warn":
                                this.Warn(message);
                                break;
                        }
                    },
                    logMigration: (message: string, queryRunner?: QueryRunner) => {
                        this.Info(message, "Migration");
                    },
                    logQuery: (query: string, parameters?: any[], queryRunner?: QueryRunner) => {
                        LogSqlQuery(query, parameters);
                    },
                    logQueryError: (error: string, query: string, parameters?: any[], queryRunner?: QueryRunner) => {
                        LogSqlQuery(query, parameters);
                    },
                    logQuerySlow: (time: number, query: string, parameters?: any[], queryRunner?: QueryRunner) => {
                        this.Warn(time, "Slow Query");
                        LogSqlQuery(query, parameters);
                    },
                    logSchemaBuild: (message: string, queryRunner?: QueryRunner) => {
                        this.Info(message, "Schema Build");
                    }
                };
                this.QueryLogger = Logger;
            }
            return this.QueryLogger;
        }
    
        public static GetLoggingTemplate(key: LogLevel) {
            if (this.LoggingTemplates === null) {
                let Templates = {};
    
                Templates[LogLevel.TRACE] = Chalk.black.bgWhite;
                Templates[LogLevel.DEBUG] = Chalk.white.bgBlack;
                Templates[LogLevel.INFO] = Chalk.blue.bgBlack;
                Templates[LogLevel.WARN] = Chalk.cyan.bgRed;
                Templates[LogLevel.ERROR] = Chalk.red.bgCyan;
                Templates[LogLevel.FATAL] = Chalk.red.bgBlue;
    
                this.LoggingTemplates = Templates;
            }
            return this.LoggingTemplates[key];
        }
    
        public static Info(str, tag?: string): void {
            this.Log(str, tag, LogLevel.INFO);
        }
    
        public static Warn(str, tag?: string): void {
            this.Log(str, tag, LogLevel.WARN);
        }
    
        public static Debug(str, tag?: string): void {
            this.Log(str, tag, LogLevel.DEBUG);
        }
    
        public static Error(str, tag?: string): void {
            this.Log(str, tag, LogLevel.ERROR);
        }
    
        public static Trace(str, tag?: string): void {
            this.Log(str, tag, LogLevel.TRACE);
        }
    
        public static Fatal(str, tag?: string): void {
            this.Log(str, tag, LogLevel.FATAL);
        }
    
        public static Log(str, tag?: string, logLevel: LogLevel = LogLevel.INFO): void {
            if (appEnv("LOG_LEVEL", LogLevel.ERROR) > logLevel) {
                return;
            }
    
            if (typeof str === "object") {
                console.log(str);
                console.log(str.stack);
                str = highlight(JSON.stringify(str, null, JSON_LOG_INDENTATION), {
                    language: "JSON"
                });
            }
            if (tag !== undefined) {
                console.log(Chalk.underline.white.bgBlack(tag), this.GetLoggingTemplate(logLevel)(str));
            } else {
                console.log(this.GetLoggingTemplate(logLevel)(str));
            }
        }
    }    
` ;

    return code;

};

module.exports = makeLoggerHelper;
