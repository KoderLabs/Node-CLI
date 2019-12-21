let code = '';

const makeLocaleHelper = function () {

    code = `
    import { LocaleData as En } from "../locale/EnLocale";
import { LocaleData as Ur } from "../locale/UrLocale";
import * as I18N from "roddeh-i18n";

export enum Locale {
    En,
    Ur
}

export class LocaleHelper {
    static Instance = null;
    Locales: {
        [key in keyof typeof Locale]: (key: string, dataOrN?: number | object, dataOrContext?: any, context?: any) => {}
    } = null;

    private constructor() {
        this.Locales = {
            En: I18N.create(En),
            Ur: I18N.create(Ur)
        };
    }

    static GetInstance(): LocaleHelper {
        if (this.Instance === null) {
            this.Instance = new this();
        }
        return this.Instance;
    }

    static GetLocale(val: string): Locale {
        let value = Locale.En;
        switch (val) {
            case "En":
                value = Locale.En;
                break;
            case "Ur":
                value = Locale.Ur;
                break;
        }

        return value;
    }

    Translate(locale: Locale, key: MessageTemplate, dataOrN?: number | object, dataOrContext?: any, context?: any): string {
        let Message: string = key.toString();
        const LocaleFunc = this.Locales[Locale[locale]];
        if (LocaleFunc !== undefined) {
            Message = LocaleFunc(MessageTemplate[key], dataOrN, dataOrContext, context);
        }
        return Message;
    }

    TranslateErrors(locale: Locale, errors: any) {
        if (typeof errors === "object") {
            for (let Field in errors) {
                let Messages = [];
                for (let index in errors[Field]) {
                    Messages.push(this.Translate(locale, this._getMessageTemplateByConstraint(errors[Field][index])));
                }
                errors[Field] = this.Translate(locale, MessageTemplate.FieldValidationErrors, {
                    constraints: Messages.join(this.Translate(locale, MessageTemplate.MultipleValuesGlue)),
                    field: Field
                });
            }
        }
        return errors;
    }

    private _getMessageTemplateByConstraint(key: string): MessageTemplate {
        let Value = MessageTemplate.Default;
        switch (key) {
            case "isEmail":
                Value = MessageTemplate.IsEmailConstraint;
                break;
            case "min":
                Value = MessageTemplate.MinConstraint;
                break;
        }
        return Value;
    }
}

/**
 * Alias for LocaleHelper's Translate function
 * @param {Locale} locale
 * @param {MessageTemplate} key
 * @param {number | object} dataOrN
 * @param dataOrContext
 * @param context
 * @alias LocaleHelper#Translate
 * @returns {string}
 */
export function __T(locale: Locale, key: MessageTemplate, dataOrN?: number | object, dataOrContext?: any, context?: any) {
    return LocaleHelper.GetInstance().Translate(locale, key, dataOrN, dataOrContext, context);
}

/**
 * Alias for LocaleHelper's TranslateErrors function
 * @param {Locale} locale
 * @param errors
 * @returns {Object}
 * @alias LocaleHelper#TranslateErrors
 */
export function __TE(locale: Locale, errors: any) {
    return LocaleHelper.GetInstance().TranslateErrors(locale, errors);
}

export enum MessageTemplate {
    Default,
    IsEmailConstraint,
    MultipleValuesGlue,
    FieldValidationErrors,
    DefaultForbidden,
    DefaultUnAuthorized,
    DefaultNotFound,
    DefaultServerError,
    DefaultBadRequest,
    EmailAlreadyExists,
    EmailNotRegistered,
    EmailUnVerified,
    InvalidCredentials,
    InvalidAgentIds,
    WebsiteNotFound,
    InvalidIconId,
    InvalidIconIdType,
    MinConstraint,
    ResetPasswordDescription,
    ResetPasswordTitle,
    ResetPasswordName,
    ResetPasswordPurpose,
    ResetPasswordEndingWords,
    ResetPasswordSubject,
    ResetPasswordButtonText,
    Address,
    PhoneNumber,
    Email,
    DontLikeEmails,
    Unsubscribe
}

export class TranslatableMessage {
    Key: MessageTemplate;
    DataOrN: number | object;
    DataOrContext: any;
    Context: any;

    constructor(key: MessageTemplate, dataOrN?: number | object, dataOrContext?: any, context?: any) {
        this.Key = key;
        this.DataOrN = dataOrN;
        this.DataOrContext = dataOrContext;
        this.Context = context;
    }

    Translate(locale: Locale): string {
        return __T(locale, this.Key, this.DataOrN, this.DataOrContext, this.Context);
    }
}
` ;

    return code;

};

module.exports = makeLocaleHelper;
