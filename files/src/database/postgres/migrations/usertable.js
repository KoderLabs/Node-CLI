let code = '';

const makeUserTable = function (name) {

    code = `
    import { MigrationInterface, QueryRunner } from "typeorm";

export class createUserTable1533904932008 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(\`
        CREATE TABLE users (
            id          SERIAL  PRIMARY KEY NOT NULL,
            account_id  SERIAL  NOT NULL ,
            first_name  VARCHAR(255),
            last_name   VARCHAR(255),
            email       VARCHAR(255),
            password    VARCHAR(255),
            status      SMALLINT DEFAULT 0 NOT NULL,
            type        SMALLINT DEFAULT 0 NOT NULL,
            created_at  BIGINT    NOT NULL,
            updated_at  BIGINT    NOT NULL,
            deleted_at  BIGINT  DEFAULT 0 NOT NULL
        );
        \`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(\`
        DROP TABLE users;
        \`);
    }
}

    

    
` ;

    return code;

};

module.exports = makeUserTable;

