let code = '';

const makeUserRepository = function (database) {
    database = database === "mysql" ? "MySqlRepository" : database === "postgres" ? "PostgresRepository" : database === "mongo" ? "MongoDbRepository" : "MySqlRepository";
    code = `
    ${database === "MySqlRepository" ? `  import { MySqlRepository } from "../MySqlRepository";` : ""}
    ${database === "PostgresRepository" ? `     import { PostgresRepository } from "../PostgresRepository";` : ""}
    ${database === "MongoDbRepository" ? `   import {MongoDbRepository} from "../MongoDbRepository";` : ""}
    import { UserModel } from "../../model/user/UserModel";
    export class UserRepository extends ${database}<UserModel> {
        protected DefaultOrderByColumn: string = "Id";
        protected DefaultOrderByDirection: string = "DESC";
        protected DefaultAlias: string = "user";
    
        constructor() {
            super(UserModel);
        }
    }
    
    
` ;

    return code;

};

module.exports = makeUserRepository;

