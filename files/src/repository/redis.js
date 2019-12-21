let code = '';

const makeRedisRepository = function (name) {

    code = `
    import { RedisClient } from "redis";
    import DatabaseLoader from "../database/DatabaseLoader";
    import { SSLogger } from "../helpers/LoggerHelper";
    
    export class RedisRepository {
        protected Connection: RedisClient;
    
        constructor() {
            this.Connection = DatabaseLoader.GetConnection("redis") as RedisClient;
        }
    
        private _action(action: string, ...args): Promise<any> {
            let actionFunc;
            switch (action) {
                case "get":
                    actionFunc = this.Connection.get;
                    break;
                case "set":
                    actionFunc = this.Connection.set;
                    break;
                case "del":
                    actionFunc = this.Connection.del;
            }
            return new Promise<any>((resolve, reject) => {
                args.push((err, data) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(data);
                    }
                });
                if (!actionFunc.apply(this.Connection, args)) {
                    SSLogger.Error("Redis Connection Error");
                    reject("Redis Connection Error");
                }
            });
        }
    
        public async Get(token: string): Promise<any> {
            return this._action("get", token);
        }
    
        public async Set(token, data): Promise<any> {
            return this._action("set", token, data);
        }
    
        public async Delete(token): Promise<any> {
            return this._action("del", token);
        }
    }
    
    
` ;

    return code;

};

module.exports = makeRedisRepository;

