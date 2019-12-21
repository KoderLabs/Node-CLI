let code = '';

const makeUserRepository = function (database) {
    database = database === "mysql" ? "MySQLBaseModel" : database === "postgres" ? "PostgresBaseModel" : database === "mongo" ? "MongoBaseModel" : "MySQLBaseModel";

    code = `
    import { Column, Entity, JoinColumn, ManyToOne, ManyToMany, JoinTable } from "typeorm";
    ${database === "MySQLBaseModel" ? `import { MySQLBaseModel } from "../MySQLBaseModel";` : ""}
    ${database === "PostgresBaseModel" ? ` import { PostgresBaseModel } from "../PostgresBaseModel";` : ""}
    ${database === "MongoBaseModel" ? ` import { MongoBaseModel } from "../MongoBaseModel";` : ""}
    import { Exclude } from "class-transformer";
    
    @Entity("users")
    export class UserModel extends ${database} {
        @Column({
            name: "first_name",
            type: "${database === "mongo" ? "string" : "varchar"}"
        })
        FirstName: string;
    
        @Column({
            name: "last_name",
            type: "${database === "mongo" ? "string" : "varchar"}"
        })
        LastName: string;
    
        @Column({
            name: "email",
            type: "${database === "mongo" ? "string" : "varchar"}"
        })
        Email: string;
    
        @Column({
            name: "password",
            type: "${database === "mongo" ? "string" : "varchar"}"
        })
        @Exclude()
        Password: string;
    
        @Column({
            name: "status",
            type: "${database === "mongo" ? "number" : "int"}"
        })
        Status: number;
    
        @Column({
            name: "type",
            type: "${database === "mongo" ? "number" : "int"}"
        })
        Type: number;
    }
    export enum UserModelStatus {
        Inactive = 0,
        Active = 1,
        Unverified = 2,
        Invited = 3
    }
    
    
` ;

    return code;

};

module.exports = makeUserRepository;

