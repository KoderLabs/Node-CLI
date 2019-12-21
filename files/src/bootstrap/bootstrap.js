let code = '';

const makeBootStrap = function (name) {

    code = `
import DatabaseLoader from "../database/DatabaseLoader";
import * as express from "express";
import * as http from "http";
import RouteLoader from "../route/RouteLoader";

export interface Constructable<T> {
    new (): T;
}

export interface Loadable {
    Load: ((app: express.Application, server: http.Server) => {});
}

export default class Bootstrap {
    private _loaders: Array<Constructable<Loadable>> = [DatabaseLoader, RouteLoader];

    private async _load(app: express.Application, server: http.Server): Promise<void> {
        for (let loaderClass of this._loaders) {
            let loaderInstance: Loadable = new loaderClass();
            await Promise.resolve(loaderInstance.Load(app, server));
        }
    }

    public static async boot(app: express.Application, server: http.Server): Promise<void> {
        let bootstrap = new Bootstrap();
        await bootstrap._load(app, server);
    }
}

    
` ;

    return code;

};

module.exports = makeBootStrap;

