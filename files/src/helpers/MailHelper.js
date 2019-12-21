let code = '';

const makeMailHelper = function () {

    code = `
    import { createTransport } from "nodemailer";
import { appEnv } from "./EnvHelper";
import { SSLogger } from "./LoggerHelper";
import * as Mail from "nodemailer/lib/mailer";
import { Locale } from "./LocaleHelper";
import { EmailTemplate, TemplateRenderer } from "../templates/TemplateRenderer";

export class SSMailer {
    private _transporter: Mail = null;
    private static _instance = null;

    private constructor() {
        this._transporter = createTransport({
            host: appEnv("MAIL_HOST", ""),
            port: appEnv("MAIL_PORT", 0),
            auth: {
                user: appEnv("MAIL_USER", null),
                pass: appEnv("MAIL_PASS", null)
            },
            service: "smtp",
            secure: appEnv("MAIL_SECURE", true),
            pool: true,
            from: appEnv("MAIL_FROM_NAME", "") + " <" + appEnv("MAIL_FROM_EMAIL", "") + ">"
        });
    }

    public static GetInstance(): SSMailer {
        if (this._instance === null) {
            this._instance = new this();
        }
        return this._instance;
    }

    public static async Send(to: string, subject: string, content): Promise<boolean> {
        try {
            let result = await this.GetInstance()._transporter.sendMail({
                to: to,
                subject: subject,
                html: content
            });

            SSLogger.Info("Mail Sent successfully", "MAILER");
            SSLogger.Info(result, "MAILER");

            return true;
        } catch (e) {
            SSLogger.Error(e, "MAILER");
        }
        return false;
    }

    public static async SendByTemplate(template: EmailTemplate, to, locale: Locale, data: Object) {
        let { content, subject } = TemplateRenderer[template](data, locale);
        this.Send(to, subject, content);
    }
}
` ;

    return code;

};

module.exports = makeMailHelper;
