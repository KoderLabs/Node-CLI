let code = '';

const makeUtilHelper = function (name) {

    code = `
    import { compare, genSalt, hash } from "bcrypt-nodejs";
import { appEnv } from "./EnvHelper";
import * as Morgan from "morgan";
import { Express, Request, Response } from "express";
import { default as Chalk } from "chalk";
import { AUTHORIZATION_HEADER_KEY, JSON_LOG_INDENTATION, LogLevel } from "../constant/AppConstant";
import { Logger as IQueryLogger } from "typeorm";
import { QueryRunner } from "typeorm/query-runner/QueryRunner";
import { highlight } from "cli-highlight";

export async function HashPassword(plainText: string): Promise<any> {
    return new Promise(function(resolve, reject) {
        genSalt(10, function(error, salt) {
            if (error) {
                reject(error);
            } else {
                hash(plainText, salt, null, function(error, hash) {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(hash);
                    }
                });
            }
        });
    });
}

export async function ComparePassword(plainText, hash): Promise<any> {
    return new Promise(function(resolve, reject) {
        compare(plainText, hash, function(error, result) {
            if (error) {
                reject(error);
            } else {
                resolve(result);
            }
        });
    });
}

export interface PaginationRequestParams {
    Limit: number;
    Page?: number;
    Before?: number;
    After?: number;
}

export interface PaginationDBParams {
    Limit: number;
    Offset: number | string; // Offset as string would be Id for mongo before/after pagination
}

/**
 * Casts PaginationRequestParams to PaginationDBParams
 * @param {PaginationRequestParams} params
 * @returns {PaginationDBParams}
 */
export function GetPaginationOptions(params: PaginationRequestParams) {
    let options: PaginationDBParams = {
        Limit: 10, //TODO: take this value to global constants or something
        Offset: 0
    };
    let Limit = params.Limit;
    let Page = params.Page || 1;
    let After = params.After;
    let Before = params.Before;

    if (Limit) {
        options.Limit = parseInt(Limit.toString());
    }

    if (After) {
        options.Offset = "+" + After;
    } else if (Before) {
        options.Offset = "-" + Before;
    } else if (Page) {
        options.Offset = options.Limit * Math.max(Page - 1, 0);
    }
    return options;
}

/**
 * Casts Mongo's ObjectID instance to
 * @param value - Mongo's ObjectID instance
 * @returns {string}
 * @author Shahzaib Sheikh <shahzaib.sheikh@koderlabs.com>
 */
export function ObjectIdToHexString(value: any, obj): string {
    if (!Array.isArray(ObjectIdToHexString.prototype.hexTable)) {
        // Function cache is in use here
        ObjectIdToHexString.prototype.hexTable = [];
        for (let i = 0; i < 256; i++) {
            ObjectIdToHexString.prototype.hexTable[i] = (i <= 15 ? "0" : "") + i.toString(16);
        }
    }

    const id = value && typeof value == "object" && value.id ? Object.keys(value.id).map(key => value.id[key]) : [];

    let hexString = "";
    for (const el of id) {
        hexString += ObjectIdToHexString.prototype.hexTable[el];
    }
    return hexString;
}
` ;

    return code;

};

module.exports = makeUtilHelper;

