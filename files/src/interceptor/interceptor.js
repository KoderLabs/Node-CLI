let code = '';

const makeInterceptor = function (name) {

    code = `
    import { Interceptor, InterceptorInterface } from "routing-controllers";
    import { Action } from "routing-controllers/Action";
    import { Request } from "express";
    import { __TE, LocaleHelper, TranslatableMessage } from "../helpers/LocaleHelper";
    import { LOCALE_HEADER_KEY } from "../constant/AppConstant";
    
    @Interceptor()
    export class LocaleInterceptor implements InterceptorInterface {
        // marked static cause we will need to call this from error handler middleware cz it will not be called automatically
        static Replace(obj, req: Request) {
            let Locale = LocaleHelper.GetLocale(req.header(LOCALE_HEADER_KEY));
    
            if (obj.Message instanceof TranslatableMessage) {
                obj.Message = obj.Message.Translate(Locale);
            }
    
            if (typeof obj.Errors === "object") {
                let ErrorsObj = obj.Errors;
                obj.Errors = __TE(Locale, ErrorsObj);
            }
            return obj;
        }
    
        intercept(action: Action, result: any) {
            return LocaleInterceptor.Replace(result, action.request);
        }
    }
    
` ;

    return code;

};

module.exports = makeInterceptor;

