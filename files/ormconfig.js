let config = '';

const makeOrmConfig = function () {

  config = `
    require('dotenv');
    module.exports = require('./build/config/database.config').config;  
  `;

  return config;
};

module.exports = makeOrmConfig;
