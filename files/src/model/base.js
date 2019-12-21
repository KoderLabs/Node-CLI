let code = '';

const makeBaseModel = function (name) {

    code = `
    import { BaseEntity } from "typeorm";

    export abstract class BaseModel extends BaseEntity {
        CreatedAt;
        UpdatedAt;
        DeletedAt;
    
        // @AfterLoad()
        // convertDates() {
        //     this.UpdatedAt = new Date(this.UpdatedAt);
        //     this.CreatedAt = new Date(this.CreatedAt);
        // }
    
        public Fill(obj: any): any {
            let restrictedFields = this._GetRestrictedFields();
            //Todo:it will be discussed
            let keys: string[] = Object.keys(obj);
            for (let i = 0; i < restrictedFields.length; i++) {
                if (keys.includes(restrictedFields[i])) {
                    delete obj[restrictedFields[i]];
                }
            }
            keys = Object.keys(obj);
            for (let i = 0; i < keys.length; i++) {
                if (keys[i] in this && (obj[keys[i]] || obj[keys[i]] === 0)) {
                    this[keys[i]] = obj[keys[i]];
                }
            }
            return this;
        }
    
        protected _GetRestrictedFields(): string[] {
            return ["Id"];
        }
    }
    
` ;

    return code;

};

module.exports = makeBaseModel;

