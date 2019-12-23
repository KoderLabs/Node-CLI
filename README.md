# Node-CLI (Version 1)

Generate a basic and customizable structure for node-js application

### Tech

Node CLI uses a number of open source projects to work properly:


* [Node.js](https://www.nodejs.org) - evented I/O for the backend
* [Express](https://www.expressjs.com)  - fast node.js network app framework 
* [RoutingController](https://github.com/typestack/routing-controllers)     - Create structured, declarative and beautifully organized class-based controllers with heavy decorators usage in Express / Koa using TypeScript and Routing Controllers Framework.
* [TypeORM](https://typeorm.io/)  - ORM for TypeScript and JavaScript (ES7, ES6, ES5). Supports MySQL, PostgreSQL, MariaDB, SQLite, MS SQL Server, Oracle, WebSQL databases. Works in NodeJS, Browser, Ionic, Cordova and Electron platforms.
...


### Installation

Node-CLI requires [Node.js](https://nodejs.org/) and  [Npm](https://www.npmjs.com) to run.

Clone this repo (https://github.com/KoderLabs/Node-CLI) 
### Quick Start
The quickest way to scaffold your application by following command as shown below:

```sh
> $ npm install
```

```sh
> $ npm run start <project-name>
```
project-name should be entered by user ,no default value.

Databases supported are 

Mysql(default),Postgres,MongoDb,Redis(compulsory)

```
> Want to use Mysql DataBase (1 for Yes and 0 for No) :
```
Mysql Database can be selected  by reply with 1 

If user select mysql then user will set the configuration of mysql 

```
> Mysql Host :
> Mysql Port  :
> Mysql UserName :
> Mysql Password :
> Mysql DbName :
```
Similarly user can select postgres,mongodb and set their configuration via CLI

Note : if user select more than two two database then user will have to select in which database UserModel will be saved like that 
```
>Where you want to store user model : (default postgres)  : mysql,postgres
```
After completing all the steps a folder with the given project name will be created and you can run the project by ``` npm run start ```.