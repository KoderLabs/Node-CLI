let env = '';

const makeEnv = function (mysqlData, postgresData, mongoData, redisData) {

  env = `
    ${mysqlData ? makeMysqlConfig(mysqlData) : ""}

    ${postgresData ? makePostgresConfig(postgresData) : ""}

    ${mongoData ? makeMongoConfig(mongoData) : ""}
    DB_REDIS_HOST=${redisData.host}
    DB_REDIS_PORT=${redisData.port}
    
    USE_DB_REDIS=true
    
    APP_PORT=3000
    APP_DOMAIN=
    
    DEBUG=false
    
    LOG_LEVEL=10 
    # options TRACE = 10, DEBUG = 20, INFO = 30, WARN = 40, ERROR = 50, FATAL = 60
    
    COOKIE_EXPIRY_TIME=31536000000
    
    MAIL_HOST=
    MAIL_PORT=
    MAIL_USER=
    MAIL_PASS=
    MAIL_SECURE=true
    MAIL_FROM_NAME=""
    MAIL_FROM_EMAIL=
  `;

  return env;
};

const makeMysqlConfig = function (mysqlData) {

  env = `
    DB_MYSQL_HOST=${mysqlData.host}
    DB_MYSQL_PORT=${mysqlData.port}
    DB_MYSQL_USER=${mysqlData.userName}
    DB_MYSQL_PASS=${mysqlData.password}
    DB_MYSQL_DB_NAME=${mysqlData.dbName}
    DB_MYSQL_LOGGER=true
    DB_MYSQL_MIGRATIONS_RUN=true
    
   
    USE_DB_MYSQL=true
  `;

  return env;
};

const makePostgresConfig = function (postgresData) {

  env = `
  DB_POSTGRES_HOST=${postgresData.host}
  DB_POSTGRES_PORT=${postgresData.port}
  DB_POSTGRES_USER=${postgresData.userName}
  DB_POSTGRES_PASS=${postgresData.password}
  DB_POSTGRES_DB_NAME=${postgresData.dbName}
  DB_POSTGRES_LOGGER=true
  DB_POSTGRES_MIGRATIONS_RUN=true
  
   
  USE_DB_POSTGRES=true
  `;

  return env;
};

const makeMongoConfig = function (mongoData) {

  env = `
  DB_MONGO_HOST=${mongoData.host}
  DB_MONGO_PORT=${mongoData.port}
  DB_MONGO_USER=${mongoData.userName}
  DB_MONGO_PASS=${mongoData.password}
  DB_MONGO_DB_NAME=${mongoData.dbName}
  DB_MONGO_LOGGER=true
  DB_MONGO_MIGRATIONS_RUN=true
    
  USE_DB_MONGO=true
  `;

  return env;
};

module.exports =
  makeEnv
