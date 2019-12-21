let code = '';

const makeMongoDbModel = function (name) {

    code = `
   
    import { Column, ObjectIdColumn } from "typeorm";
import { BaseModel } from "./BaseModel";
import { Transform } from "class-transformer";
import { ObjectIdToHexString } from "../helpers/UtilHelper";
import { Exclude } from "class-transformer";

import { ObjectId } from "mongodb";

export abstract class MongoBaseModel extends BaseModel {
    @ObjectIdColumn({
        name: "_id"
    })
    @Transform(ObjectIdToHexString, { toPlainOnly: true })
    @Transform(
        value => {
            return new ObjectId(value);
        },
        { toClassOnly: true }
    )
    Id: ObjectId;

    @Transform(
        value => {
            return new ObjectId(value);
        },
        { toClassOnly: true }
    )
    _id: ObjectId;

    @Column()
    // @Exclude() // it might be useful client side
    CreatedAt;

    @Column()
    @Exclude()
    UpdatedAt;

    @Column()
    @Exclude()
    DeletedAt;
}

` ;

    return code;

};

module.exports = makeMongoDbModel;

