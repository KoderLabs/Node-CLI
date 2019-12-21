let code = '';

const makeLocale = function (name) {

    code = `
    import { MessageTemplate } from "../helpers/LocaleHelper";

    export interface LocaleKBInterface {
        values: {[key in keyof typeof MessageTemplate]: string | Array<any>}
        context?: Array<LocaleContextInterface>;
    }
    
    interface LocaleContextInterface {
        matches: { [key: string]: string | number },
        values: {[key in keyof typeof MessageTemplate]: string | Array<any>}
    }
    
` ;

    return code;

};

module.exports = makeLocale;

