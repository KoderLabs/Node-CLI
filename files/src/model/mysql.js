let code = '';

const makeMysqlModel = function (name) {

    code = `
    import { BaseModel } from "./BaseModel";
    import { AfterLoad, Column, PrimaryGeneratedColumn } from "typeorm";
    
    import { Exclude } from "class-transformer";
    
    export abstract class MySQLBaseModel extends BaseModel {
        @PrimaryGeneratedColumn({
            name: "id",
            type: "bigint"
        })
        Id: number;
    
        @Column({
            name: "created_at",
            type: "bigint"
        })
        // @Exclude() // it might be useful client side
        CreatedAt;
    
        @Column({
            name: "updated_at",
            type: "bigint"
        })
        @Exclude()
        UpdatedAt;
    
        @Column({
            name: "deleted_at",
            type: "bigint"
        })
        @Exclude()
        DeletedAt;
    
        @AfterLoad()
        castIdToNumber() {
            // console.log(this);
        }
    }
    
    
` ;

    return code;

};

module.exports = makeMysqlModel;

