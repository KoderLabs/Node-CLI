let code = '';

const appConstant = function (name) {

    code = `
    import { appEnv } from "../helpers/EnvHelper";
    import { Locale } from "../helpers/LocaleHelper";
    
    export const AUTHORIZATION_HEADER_KEY = "authorization";
    export const LOCALE_HEADER_KEY = "locale";
    export const JSON_LOG_INDENTATION = 2;
    export const DEFAULT_LOCALE = Locale.En;
    export enum LogLevel {
        TRACE = 10,
        DEBUG = 20,
        INFO = 30,
        WARN = 40,
        ERROR = 50,
        FATAL = 60
    }
    export const FORGET_PASSWORD_LINK = \`http://\${appEnv("APP_DOMAINs", "")}/forget-password/\`; //Todo Link should be replaced
    export enum AuthenticationCodes {
        UserLoginSuccess = 10,
        UserVerificationPending = 20,
        UserSignUpSuccess = 30,
        AlreadyRegistered = 71,
        InvalidToken = 72
    }


    ` ;

    return code;

};

module.exports = appConstant;

