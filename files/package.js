let json = '';

const makePackageJSON = function (name, database) {

  json = `
  {
    "name": "${name}",
    "version": "0.1.0",
    "private": true,
    "main": "build/Server.js",
    "scripts": {
      "test": "echo \\\"Error: no test specified\\\" && exit 1",
      "watch": "tsc -w -p .",
      "debug": "nodemon --legacy-watch --watch ./build --inspect=0.0.0.0:9229 --nolazy ./build/Server.js",
      "start": "npm install && npm run build && npm run migrate && node ./build/Server.js",
      "dev-win": "start npm run watch && npm run debug",
      "dev": "concurrently \\\"npm run watch\\\" \\\"npm run debug\\\"",
      "build": "tsc -p .&& npm run copy",
      "copy": "copyfiles -u 2 \\\"./src/templates/*.html\\\" \\\"./build/templates/\\\"",
      "migrate": "node ./node_modules/typeorm/cli.js migration:run -c ${database}",
      "migrate-back": "node ./node_modules/typeorm/cli.js migration:revert -c ${database}",
      "docker-setup": "npm install nodemon && npm install ts-node && npm install typescript && npm start",
      "docker-debug": "npm install nodemon && npm install ts-node && npm install typescript && npm run dev",
      "format": "prettier --write 'src/**/*.{ts,js,jsx}'"
    },
    "devDependencies": {
      "@types/async": "^2.0.49",
      "@types/bcrypt-nodejs": "0.0.30",
      "@types/chalk": "^2.2.0",
      "@types/compression": "0.0.36",
      "@types/cookie-parser": "^1.4.1",
      "@types/cors": "^2.8.4",
      "@types/dotenv": "^4.0.3",
      "@types/errorhandler": "0.0.32",
      "@types/express": "^4.16.0",
      "@types/js-cookie": "^2.1.0",
      "@types/lusca": "^1.5.0",
      "@types/mongodb": "^3.1.9",
      "@types/morgan": "^1.7.35",
      "@types/mustache": "^0.8.32",
      "@types/node": "^10.9.4",
      "@types/redis": "^2.8.6",
      "@types/request": "^2.47.1",
      "@types/socket.io": "^1.4.38",
      "@types/uuid": "^3.4.3",
      "babel-cli": "^6.26.0",
      "babel-preset-env": "^1.7.0",
      "babel-preset-es2015": "^6.24.1",
      "mustache": "^3.0.1",
      "ts-node": "^7.0.1"
    },
    "dependencies": {
      "@types/nodemailer": "^4.6.5",
      "bcrypt-nodejs": "0.0.3",
      "chalk": "^2.4.1",
      "class-validator-jsonschema": "^1.1.2",
      "compression": "^1.7.3",
      "cookie-parse": "^0.4.0",
      "cookie-parser": "^1.4.3",
      "copyfiles": "^2.1.0",
      "cors": "^2.8.4",
      "dotenv": "^6.0.0",
      "errorhandler": "^1.5.0",
      "express": "^4.16.3",
      "express-jwt": "^5.3.1",
      "express-session": "^1.15.6",
      "js-cookie": "^2.2.0",
      "lusca": "^1.6.1",
      "mongodb": "^3.1.1",
      "morgan": "^1.9.1",
      "multer": "^1.3.1",
      "mysql": "^2.16.0",
      "nodemailer": "^4.6.8",
      "nodemon": "^1.18.9",
      "path": "^0.12.7",
      "pg": "^7.10.0",
      "redis": "^2.8.0",
      "reflect-metadata": "^0.1.12",
      "roddeh-i18n": "^1.1.1",
      "routing-controllers": "^0.7.7",
      "routing-controllers-openapi": "1.4.0",
      "socket.io": "^2.1.1",
      "swagger-ui-express": "^3.0.10",
      "typedi": "^0.8.0",
      "typeorm": "^0.2.7",
      "typescript": "^3.2.2",
      "uuid": "^3.3.2"
    }
  }  
`;

  return json;
};

module.exports = makePackageJSON;
