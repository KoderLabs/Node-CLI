let code = '';

const makeAuthService = function (name) {

    code = `
    import { Service } from "typedi";
    import { RedisRepository } from "../repository/RedisRepository";
    import { v4 as uuid } from "uuid";
    import { UserModel } from "../model/user/UserModel";
    import { UserRepository } from "../repository/user/UserRepository";
    import { appEnv } from "../helpers/EnvHelper";
    
    export class Auth {
        public UserId: number;
        public User: UserModel;
    
        constructor(userId: number, user?: UserModel) {
            this.UserId = userId;
            if (user) {
                this.User = user;
            }
        }
    }
    
    @Service()
    export class AuthService {
        constructor(private _redisRepository: RedisRepository, private _userRepository: UserRepository) {}
    
        private static _generateToken(): string {
            return uuid();
        }
    
        private static _getKey(token: string): string {
            return "TOKEN:" + token;
        }
    
        public GetToken(): string {
            return AuthService._generateToken();
        }
    
        public async CreateSession(userId: number): Promise<string> {
            let token: string = AuthService._generateToken();
            let TokenData: Auth = new Auth(userId);
            if (appEnv("USE_DB_REDIS", false)) {
                await this._redisRepository.Set(AuthService._getKey(token), JSON.stringify(TokenData));
            }
            return token;
        }
    
        public async SetSession(token: string, userId: number): Promise<boolean> {
            let TokenData: Auth = new Auth(userId);
            if (appEnv("USE_DB_REDIS", false)) {
                await this._redisRepository.Set(AuthService._getKey(token), JSON.stringify(TokenData));
            }
            return true;
        }
    
        public async DestroySession(token: string): Promise<boolean> {
            if (appEnv("USE_DB_REDIS", false)) {
                await this._redisRepository.Delete(AuthService._getKey(token));
            }
            return true;
        }
    
        public async GetSession(token: string): Promise<Auth> {
            if (appEnv("USE_DB_REDIS", false)) {
                let RawData: string = await this._redisRepository.Get(AuthService._getKey(token));
                if (RawData) {
                    let RawObject = JSON.parse(RawData);
                    let Data: Auth = new Auth(RawObject.UserId);
                    Data.User = await this._userRepository.FindById(Data.UserId);
                    return Data;
                }
                return null;
            }
        }
    }
    
    
` ;

    return code;

};

module.exports = makeAuthService;

