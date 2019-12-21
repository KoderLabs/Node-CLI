let code = '';

const makeDatabaseLoader = function (name) {

    code = `
    import { Connection, createConnection } from "typeorm";
import { createClient, RedisClient } from "redis";
import { appEnv } from "../helpers/EnvHelper";
import { SSLogger } from "../helpers/LoggerHelper";

export interface KeyValuePair<T> {
    [key: string]: T;
}

export default class DatabaseLoader {
    private static _connections: KeyValuePair<Connection | RedisClient> = {
        mysql: null,
        redis: null,
        mongodb: null,
        postgres: null
    };

    private static _createRedisConnection(): RedisClient {
        return createClient({
            host: appEnv("DB_REDIS_HOST", "localhost"),
            port: appEnv("DB_REDIS_PORT", 27017),
            enable_offline_queue: false
        });
    }

    public async Load(): Promise<void> {
        SSLogger.Info("Connection Loading");
        for (let key in DatabaseLoader._connections) {
            if (key == "postgres" && !appEnv("USE_DB_POSTGRES", false)) {
                continue;
            }
            if (key == "mongodb" && !appEnv("USE_DB_MONGO", false)) {
                continue;
            }
            if (key == "mysql" && !appEnv("USE_DB_MYSQL", false)) {
                continue;
            }
            if (key == "redis" && !appEnv("USE_DB_REDIS", false)) {
                continue;
            }
            if (key == "redis" && appEnv("USE_DB_REDIS", false)) {
                DatabaseLoader._connections[key] = DatabaseLoader._createRedisConnection();
                continue;
            }
            DatabaseLoader._connections[key] = await createConnection(key);
        }
        SSLogger.Info("Connection Loaded");
    }

    public static GetConnection(key: string): Connection | RedisClient {
        return DatabaseLoader._connections[key] ? DatabaseLoader._connections[key] : null;
    }
}


    
` ;

    return code;

};

module.exports = makeDatabaseLoader;

