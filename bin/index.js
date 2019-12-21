#! /usr/bin/env node

const log = require('tracer').console({
  format: `{{message}}  - {{file}}:{{line}}`
}).log;
const co = require('co');
const prompt = require('co-prompt');
const mkdirp = require('mkdirp');
const program = require('commander');
const fs = require('fs');
const readlineSync = require('readline-sync');

const gitIgnore = require('../files/gitIgnore');
const packageJson = require('../files/package');
const envExample = require('../files/envexample');
const ormConfig = require('../files/ormconfig');
const tsConfig = require('../files/tsconfig');
const appJS = require("../files/src/app");
const server = require("../files/src/server");
const routes = require("../files/src/route/route");
const databaseConfig = require("../files/src/config/database.config")
const uploadConfig = require("../files/src/config/upload.config");
const bootstrap = require("../files/src/bootstrap/bootstrap");
const authController = require("../files/src/controller/user/auth.controller");
const userController = require("../files/src/controller/user/user.controller");
const userRequest = require("../files/src/controller/user/user.request");
const userResponse = require("../files/src/controller/user/user.response");
const documentController = require("../files/src/controller/document");
const mysqlMigration = require("../files/src/database/mysql/migrations/usertable");
const postgresMigration = require("../files/src/database/postgres/migrations/usertable");
const databaseLoader = require("../files/src/database/database");
const exception = require("../files/src/exception/exception");
const envHelper = require("../files/src/helpers/EnvHelper");
const localeHelper = require("../files/src/helpers/LocaleHelper");
const loggerHelper = require("../files/src/helpers/LoggerHelper");
const utilHelper = require("../files/src/helpers/UtilHelper");
const mailHelper = require("../files/src/helpers/MailHelper");
const openApiHelper = require("../files/src/helpers/OpenAPIHelper");
const interceptor = require("../files/src/interceptor/interceptor");
const enLocale = require("../files/src/locale/enlocale");
const urLocale = require("../files/src/locale/urlocale");
const locale = require("../files/src/locale/locale");
const compressionMiddleware = require("../files/src/middleware/compression");
const corsMiddleware = require("../files/src/middleware/cors");
const errorMiddleware = require("../files/src/middleware/error");
const loggerMiddleware = require("../files/src/middleware/logger");
const indexMiddleware = require("../files/src/middleware/index");
const userModel = require("../files/src/model/user/user.model");
const baseModel = require("../files/src/model/base");
const mysqlModel = require("../files/src/model/mysql");
const mongoModel = require("../files/src/model/mongodb");
const postgresModel = require("../files/src/model/postgres");
const UserRepository = require("../files/src/repository/user/user.repository");
const baseRepository = require("../files/src/repository/base");
const mysqlRepository = require("../files/src/repository/mysql");
const mongoRepository = require("../files/src/repository/mongodb");
const postgresRepository = require("../files/src/repository/postgres");
const redisRepository = require("../files/src/repository/redis");
const userService = require("../files/src/service/user/user.service");
const authService = require("../files/src/service/auth");
const responseCommon = require("../files/src/response/common");
const responseIndex = require("../files/src/response/index");
const passwordTemplate = require("../files/src/template/resetPasswordTemplate");
const templateRenderer = require("../files/src/template/templateRender");
const appConstant = require("../files/src/constant/appConstant");

let name;

function makeDir(dirName) {
  mkdirp(`../../${name}/${dirName}`, function (err) {
    if (err) {
      log(err);
    }

  });

}

function makeFile(dir, fileName, fileData) {

  makeDir(dir);

  fs.writeFile(`../../${name}/${dir}/${fileName}`, fileData, function (err) {
    if (err) {
      return log(err);
    }
    log(`${name}/${dir}/${fileName}created`);

  });
}
program

  .action(function () {
    co(function* () {
      name = process.argv[2].toString();

      if (!name) { name = `generator`; }
      mkdirp(`../../${name}`, function (err) {
        if (err) {
          return log(err);
        }
      });
      let mysql = null;
      let postgres = null;
      let mongo = null;
      const useMysql = readlineSync.question('Want to use Mysql DataBase (1 for Yes and 0 for No) : ');
      if (parseInt(useMysql)) {
        let mysqlData = {};
        mysqlData.host = readlineSync.question('Mysql Host : ');
        mysqlData.port = readlineSync.question('Mysql Port  : ');
        mysqlData.userName = readlineSync.question('Mysql UserName : ');
        mysqlData.password = readlineSync.question('Mysql Password : ');
        mysqlData.dbName = readlineSync.question('Mysql DbName : ');
        mysql = mysqlData;
      }

      const usePostgres = readlineSync.question('Want to use Postgres DataBase (1 for Yes and 0 for No) : ');
      if (parseInt(usePostgres)) {
        let postgresData = {};
        postgresData.host = readlineSync.question('Postgres Host : ');
        postgresData.port = readlineSync.question('Postgres Port  : ');
        postgresData.userName = readlineSync.question('Postgres UserName : ');
        postgresData.password = readlineSync.question('Postgres Password : ');
        postgresData.dbName = readlineSync.question('Postgres DbName : ');
        postgres = postgresData;
      }

      const useMongo = readlineSync.question('Want to use Mongo DataBase (1 for Yes and 0 for No) : ');
      if (parseInt(useMongo)) {
        let mongoData = {};
        mongoData.host = readlineSync.question('Mongo Host : ');
        mongoData.port = readlineSync.question('Mongo Port  : ');
        mongoData.userName = readlineSync.question('Mongo UserName : ');
        mongoData.password = readlineSync.question('Mongo Password : ');
        mongoData.dbName = readlineSync.question('Mongo DbName : ');
        mongo = mongoData;
      }

      if (!mysql && !postgres && !mongo) {
        let mysqlData = {};
        mysqlData.host = readlineSync.question('Mysql Host : ');
        mysqlData.port = readlineSync.question('Mysql Port  : ');
        mysqlData.userName = readlineSync.question('Mysql UserName : ');
        mysqlData.password = readlineSync.question('Mysql Password : ');
        mysqlData.dbName = readlineSync.question('Mysql DbName : ');
        mysql = mysqlData;
      }
      let redis = {}
      redis.host = readlineSync.question('Redis Host : ');
      redis.port = readlineSync.question('Redis Port  : ');
      makeFile('', '.gitIgnore', gitIgnore());
      makeFile('', 'package.json', packageJson(name, mysql ? "mysql" : postgres ? "postgres" : "mysql"));
      makeFile('', 'ormconfig.js', ormConfig())
      makeFile('', 'tsconfig.json', tsConfig())

      makeFile('src', 'App.ts', appJS());
      makeFile('src', 'Server.ts', server())
      makeFile("src/model", "BaseModel.ts", baseModel())
      makeFile("src/repository", "BaseRepository.ts", baseRepository())
      makeFile("src/database", "DatabaseLoader.ts", databaseLoader());
      let database = {};
      if (mysql) {
        makeFile("src/model", "MySQLBaseModel.ts", mysqlModel())
        makeFile("src/model/user/", "UserModel.ts", userModel("mysql"));
        makeFile("src/repository", "MySqlRepository.ts", mysqlRepository())
        makeFile("src/repository/user/", "UserRepository.ts", UserRepository("mysql"))
        makeDir("src/database/mysql")
        makeFile("src/database/mysql/migration/", "1533904932008-create-user-table.ts", mysqlMigration())
        database.mysql = "mysql"
      }
      if (postgres) {
        makeFile("src/model", "PostgresBaseModel.ts", postgresModel())
        makeFile("src/model/user/", "UserModel.ts", userModel("postgres"));
        makeFile("src/repository", "PostgresRepository.ts", postgresRepository())
        makeFile("src/repository/user/", "UserRepository.ts", UserRepository("postgres"))
        makeDir("src/database/postgres")
        makeFile("src/database/postgres/migration/", "1533904932008-create-user-table.ts", postgresMigration())
        database.postgres = "postgres"
      }
      if (mongo) {
        makeFile("src/model", "MongoBaseModel.ts", mongoModel())
        makeFile("src/model/user/", "UserModel.ts", userModel("mongo"));
        makeFile("src/repository", "MongoDbRepository.ts", mongoRepository())
        makeFile("src/repository/user/", "UserRepository.ts", UserRepository("mongo"))
        database.mongo = "mongo"
      }

      if (Object.keys(database).length > 1) {
        var keys = Object.keys(database);
        var userDatabase = readlineSync.question(`Where you want to store user model : (default ${keys[keys.length - 1]})  : ${keys} `, );
        if (userDatabase.toLowerCase() == "mongo") {
          makeFile("src/model/user/", "UserModel.ts", userModel("mongo"));
          makeFile("src/repository/user/", "UserRepository.ts", UserRepository("mongo"))
        } else if (userDatabase.toLowerCase() === "postgres") {
          makeFile("src/model/user/", "UserModel.ts", userModel("postgres"));
          makeFile("src/repository/user/", "UserRepository.ts", UserRepository("postgres"))
        } else if (userDatabase.toLowerCase() === "mysql") {
          makeFile("src/model/user/", "UserModel.ts", userModel("mysql"));
          makeFile("src/repository/user/", "UserRepository.ts", UserRepository("mysql"))
        }
      }

      makeFile('', '.env', envExample(mysql, postgres, mongo, redis))
      makeFile('src/route', 'RouteLoader.ts', routes())
      makeFile('src/bootstrap', 'Bootstrap.ts', bootstrap())
      makeFile('src/config', 'database.config.ts', databaseConfig(mysql, postgres, mongo))
      makeFile('src/config', 'upload.config.ts', uploadConfig());
      makeFile("src/controller/", "DocumentController.ts", documentController())
      makeFile("src/controller/user", "AuthController.ts", authController())
      makeFile("src/controller/user/", "UserController.ts", userController())
      makeFile("src/controller/user/", "UserRequest.ts", userRequest())
      makeFile("src/controller/user/", "UserResponse.ts", userResponse())
      makeFile("src/exception", "ResponseException.ts", exception());
      makeFile("src/helpers", "EnvHelper.ts", envHelper());
      makeFile("src/helpers", "LocaleHelper.ts", localeHelper());
      makeFile("src/helpers", "LoggerHelper.ts", loggerHelper());
      makeFile("src/helpers", "MailHelper.ts", mailHelper());
      makeFile("src/helpers", "UtilHelper.ts", utilHelper());
      makeFile("src/helpers", "OpenAPIHelper.ts", openApiHelper());
      makeFile("src/interceptor", "LocaleInterceptor.ts", interceptor());
      makeFile("src/locale", "EnLocale.ts", enLocale());
      makeFile("src/locale", "UrLocale.ts", urLocale());
      makeFile("src/locale", "LocaleKBInterface.ts", locale());
      makeFile("src/middleware", "CompressionMiddleware.ts", compressionMiddleware());
      makeFile("src/middleware", "CorsMiddleware.ts", corsMiddleware());
      makeFile("src/middleware", "ErrorHandlerMiddleware.ts", errorMiddleware());
      makeFile("src/middleware", "LoggingMiddleware.ts", loggerMiddleware());
      makeFile("src/middleware", "index.ts", indexMiddleware());
      makeFile("src/repository", "RedisRepository.ts", redisRepository())
      makeFile("src/service", "AuthService.ts", authService())
      makeFile("src/service/user/", "UserService.ts", userService())
      makeFile("src/response/", "common.ts", responseCommon())
      makeFile("src/response/", "index.ts", responseIndex())
      makeFile("src/templates", "TemplateRenderer.ts", templateRenderer())
      makeFile("src/templates", "ResetPasswordTemplate.html", passwordTemplate())
      makeFile("src/constant", "AppConstant.ts", appConstant())
    });
  })

  .parse(process.argv);

