let code = '';

const makeTemplateRender = function (name) {

    code = `
    import { render as MustacheRender } from "mustache";
    import * as fs from "fs";
    import * as path from "path";
    import { MessageTemplate, __T } from "../helpers/LocaleHelper";
    
    let ResetPasswordTemplatePath = "/ResetPasswordTemplate.html";
    
    export enum EmailTemplate {
        ResetPassword = "ResetPassword"
    }
    
    export let TemplateRenderer: { [key in keyof typeof EmailTemplate]: (data, locale) => { subject: string; content: string } } = {
        ResetPassword: (data, locale) => {
            let ResetPasswordHTML = fs.readFileSync(path.resolve(__dirname + ResetPasswordTemplatePath), "utf-8");
            let ResetPasswordTemplate = MustacheRender(ResetPasswordHTML, {
                Description: __T(locale, MessageTemplate.ResetPasswordDescription),
                Title: __T(locale, MessageTemplate.ResetPasswordTitle),
                Purpose: __T(locale, MessageTemplate.ResetPasswordPurpose),
                ButtonText: __T(locale, MessageTemplate.ResetPasswordButtonText),
                EndingWords: __T(locale, MessageTemplate.ResetPasswordEndingWords),
                Address: __T(locale, MessageTemplate.Address),
                PhoneNumber: __T(locale, MessageTemplate.PhoneNumber),
                Email: __T(locale, MessageTemplate.Email),
                DontLikeEmails: __T(locale, MessageTemplate.DontLikeEmails),
                Unsubscribe: __T(locale, MessageTemplate.Unsubscribe),
                Link: data.Link
            });
            let subject = __T(locale, MessageTemplate.ResetPasswordSubject);
            return { content: ResetPasswordTemplate, subject: subject };
        }
    };
    
` ;

    return code;

};

module.exports = makeTemplateRender;

