let code = '';

const makePostgresModel = function (name) {

    code = `
    import { BaseModel } from "./BaseModel";
    import { AfterLoad, Column, PrimaryGeneratedColumn } from "typeorm";
    
    import { Exclude } from "class-transformer";
    
    export abstract class PostgresBaseModel extends BaseModel {
        @PrimaryGeneratedColumn({
            name: "id",
            type: "int"
        })
        Id: number;
    
        @Column({
            name: "created_at",
            type: "int"
        })
        // @Exclude() // it might be useful client side
        CreatedAt;
    
        @Column({
            name: "updated_at",
            type: "int"
        })
        @Exclude()
        UpdatedAt;
    
        @Column({
            name: "deleted_at",
            type: "int"
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

module.exports = makePostgresModel;

