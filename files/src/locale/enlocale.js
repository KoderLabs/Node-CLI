let code = '';

const makeEnLocale = function (name) {

    code = `
    import { LocaleKBInterface } from "./LocaleKBInterface";

    export const LocaleData: LocaleKBInterface = {
        values: {
            DefaultForbidden: "Access not allowed",
            Default: "Message Error",
            FieldValidationErrors: "%{field} must be %{constraints}",
            IsEmailConstraint: "",
            MultipleValuesGlue: ",",
            DefaultNotFound: "Resource not found",
            DefaultServerError: "Something went wrong",
            DefaultBadRequest: "Bad request, Check input",
            DefaultUnAuthorized: "Not Authorized",
            EmailAlreadyExists: "Email already exists",
            EmailNotRegistered: "Email not registered",
            EmailUnVerified: "Email is not verified",
            InvalidAgentIds: "Invalid Agent Ids",
            InvalidCredentials: "Invalid Credentials",
            InvalidIconId: "IconId is Invalid",
            InvalidIconIdType: "IconId should be of image type",
            WebsiteNotFound: "Website not found",
            MinConstraint: "greater",
            Address: "950 E. State Highway 114, Suite 160, Southlake, Texas, 76092",
            PhoneNumber: "+1-646-801-9992",
            Email: "support@app.io",
            DontLikeEmails: "Don't like these emails?",
            Unsubscribe: "Unsubscribe",
            ResetPasswordDescription: "It's time to set your new Password",
            ResetPasswordTitle: "Reset Password",
            ResetPasswordName: "",
            ResetPasswordPurpose: "Please verify your email address by clicking on the button or paste this given url in browser",
            ResetPasswordEndingWords: "Thank you ,Good Luck",
            ResetPasswordSubject: "Reset Password",
            ResetPasswordButtonText: "Verify Email"
        }
    };
    
    
` ;

    return code;

};

module.exports = makeEnLocale;

