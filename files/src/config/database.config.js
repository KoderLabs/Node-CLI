let code = '';

const makeDataBaseConfig = function (mysqlData, postgresData, mongoData) {

    code = `
    import { appEnv } from "../helpers/EnvHelper";
    import { SSLogger } from "../helpers/LoggerHelper";
    
    export const config = [
        ${mysqlData ? makeMysqlConfig() : ""}

        ${postgresData ? makePostgresConfig() : ""}
    
        ${mongoData ? makeMongoConfig() : ""}
    ];
    
` ;

    return code;

};

const makeMysqlConfig = function () {
    let code = `
    {
        /**
         * MySql Database Configuration
         */
        name: "mysql",
        type: "mysql",
        host: appEnv("DB_MYSQL_HOST", "localhost"),
        port: appEnv("DB_MYSQL_PORT", 3306),
        username: appEnv("DB_MYSQL_USER", "root"),
        password: appEnv("DB_MYSQL_PASS", ""),
        database: appEnv("DB_MYSQL_DB_NAME", "app"),
        synchronize: false,
        logger: SSLogger.GetQueryLogger(),
        logging: "all",
        migrationsRun: true,
        bigNumberStrings: false,
        entities: ["build/model/user/UserModel.js"],
        // "subscribers": [
        //     "src/subscriber/*.js"
        // ],
        migrations: ["build/database/mysql/migration/*.js"],
        cli: {
            entitiesDir: "build/model",
            migrationsDir: "build/database/migration"
            // "subscribersDir": "src/subscriber"
        }
    },
    `
    return code;
}

const makePostgresConfig = function () {
    let code = `
    {
        /**
         * POSTGRES SQL Database Configuration
         */
        name: "postgres",
        type: "postgres",
        host: appEnv("DB_POSTGRES_HOST", "localhost"),
        port: appEnv("DB_POSTGRES_PORT", 5432),
        username: appEnv("DB_POSTGRES_USER", "root"),
        password: appEnv("DB_POSTGRES_PASS", ""),
        database: appEnv("DB_POSTGRES_DB_NAME", "app"),
        synchronize: false,
        logger: SSLogger.GetQueryLogger(),
        logging: "all",
        migrationsRun: true,
        bigNumberStrings: false,
        entities: ["build/model/user/UserModel.js"],
        // "subscribers": [
        //     "src/subscriber/*.js"
        // ],
        migrations: ["build/database/postgres/migration/*.js"],
        cli: {
            entitiesDir: "build/model",
            migrationsDir: "build/database/migration"
            // "subscribersDir": "src/subscriber"
        }
    },
    `
    return code;
}


const makeMongoConfig = function () {
    let code = `
    {
        /**
         * Mongo Db Configuration
         */
        name: "mongodb",
        type: "mongodb",
        host: appEnv("DB_MONGO_HOST", "localhost"),
        port: appEnv("DB_MONGO_PORT", 27017),
        username: appEnv("DB_MONGO_USER", "root"),
        password: appEnv("DB_MONGO_PASS", ""),
        database: appEnv("DB_MONGO_DB_NAME", "appdb"),
        synchronize: false,
        logger: SSLogger.GetQueryLogger(),
        logging: "all",
        migrationsRun: false,
        entities: [],
        // "subscribers": [
        //     "src/subscriber/*.js"
        // ],
        migrations: ["build/database/migrations/*.js"],
        cli: {
            entitiesDir: "src/model",
            migrationsDir: "src/database/migration"
            // "subscribersDir": "src/subscriber"
        }
    }
    `
    return code;
}


module.exports = makeDataBaseConfig;

