let code = '';

const makeUserTable = function (name) {

    code = `
    import { MigrationInterface, QueryRunner } from "typeorm";

    export class createUserTable1533904932008 implements MigrationInterface {
        public async up(queryRunner: QueryRunner): Promise<any> {
            await queryRunner.query(\`
            CREATE TABLE users
            (
                id          BIGINT PRIMARY KEY                  NOT NULL AUTO_INCREMENT,
                first_name  varchar(255),
                last_name   varchar(255),
                email       varchar(255),
                password    varchar(255),
                status      TINYINT DEFAULT 0 NOT NULL,
                type        TINYINT,
                created_at  BIGINT   NOT NULL,
                updated_at  BIGINT   NOT NULL,
                deleted_at  BIGINT DEFAULT 0 NOT NULL
            );
            \`);
        }
    
        public async down(queryRunner: QueryRunner): Promise<any> {
            await queryRunner.query(\`
            DROP TABLE user;
            \`);
        }
    }
    

    
` ;

    return code;

};

module.exports = makeUserTable;

