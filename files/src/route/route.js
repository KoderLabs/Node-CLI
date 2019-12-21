let code = '';

const makeRoute = function (name) {

    code = `
    import { useContainer, useExpressServer } from "routing-controllers";
    import { Container } from "typedi";
    import { CompressionMiddleware, CorsMiddleware, ErrorHandlerMiddleware, LoggingMiddleware } from "../middleware";
    import { Action } from "routing-controllers/Action";
    import { UserController } from "../controller/user/UserController";
    import { Auth, AuthService } from "../service/AuthService";
    import { DocumentController } from "../controller/DocumentController";
    import { AuthController } from "../controller/user/AuthController";
    import { AUTHORIZATION_HEADER_KEY } from "../constant/AppConstant";
    import { LocaleInterceptor } from "../interceptor/LocaleInterceptor";
    
    export default class RouteLoader {
        public async Load(app?: Express.Application): Promise<void> {
            useContainer(Container);
            useExpressServer(app, {
                development: true,
                classTransformer: true,
                controllers: [DocumentController, AuthController, UserController],
                validation: {
                    skipMissingProperties: false,
                    // whitelist: true,
                    // forbidNonWhitelisted: true,
                    // forbidUnknownValues: true,
    
                    //     // groups
                    //     dismissDefaultMessages: false,
                    validationError: {
                        target: true,
                        value: true
                    }
                },
                defaultErrorHandler: false,
                middlewares: [LoggingMiddleware, ErrorHandlerMiddleware, CompressionMiddleware, CorsMiddleware],
                interceptors: [LocaleInterceptor],
                authorizationChecker: async (action: Action, roles: any[]): Promise<boolean> => {
                    let authService = Container.get(AuthService);
                    const token = action.request.headers[AUTHORIZATION_HEADER_KEY];
    
                    if (token) {
                        let auth: Auth = await authService.GetSession(token);
                        if (auth) {
                            action.request.auth = auth;
                            return true;
                        }
                    }
                    return false;
                },
                currentUserChecker: async (action: Action) => {
                    if (action.request.auth instanceof Auth) {
                        return action.request.auth.User;
                    }
                    return null;
                }
            });
        }
    }
    
    
` ;

    return code;

};

module.exports = makeRoute;

