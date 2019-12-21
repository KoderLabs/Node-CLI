let code = '';

const makeMysqlRepository = function (name) {

    code = `
    import { BaseRepository } from "./BaseRepository";
    import { BaseModel } from "../model/BaseModel";
    import { PaginationDBParams } from "../helpers/UtilHelper";
    import { SelectQueryBuilder } from "typeorm";
    
    export abstract class MySqlRepository<T extends BaseModel> extends BaseRepository<T> {
        protected abstract DefaultAlias: string;
    
        protected constructor(model) {
            super(model, "mysql");
            this.SetRepo();
        }
    
        public async Create(instance: T): Promise<T> {
            return this.Reload(await this.Save(instance));
        }
    
        protected ApplyConditionOnQueryBuilder(query: SelectQueryBuilder<T>, params): SelectQueryBuilder<T> {
            if (params.DeletedAt === undefined) {
                params.DeletedAt = 0;
            }
    
            for (let key in params) {
                let Val = params[key];
                let Str = "";
                if (Array.isArray(Val)) {
                    Str = this.ToDBCase(key) + " IN (:..." + key + ")";
                } else if (Val === null) {
                    Str = this.ToDBCase(key) + " IS NULL";
                } else {
                    Str = this.ToDBCase(key) + " = :" + key;
                }
                let param = {};
                param[key] = Val;
                query = query.andWhere(this.DefaultAlias + "." + Str, param);
            }
            return query;
        }
    
        protected ToDBCase(str: string) {
            return typeof str === "string"
                ? str
                      .replace(/(?:^|\.?)([A-Z])/g, function(x, y) {
                          return "_" + y.toLowerCase();
                      })
                      .replace(/^_/, "")
                : str;
        }
    
        protected ApplyOrderOnQueryBuilder(
            query: SelectQueryBuilder<T>,
            orderOptions?: { Column: string; Direction: "ASC" | "DESC" }
        ): SelectQueryBuilder<T> {
            let order: any = super.ApplyOrder({}, orderOptions).order;
            let preparedOrder = {};
            for (var key in order) {
                preparedOrder[this.DefaultAlias + "." + key] = order[key];
            }
            return query.orderBy(preparedOrder);
        }
    
        protected ApplyPaginationOnQueryBuilder(query: SelectQueryBuilder<T>, options?: PaginationDBParams): SelectQueryBuilder<T> {
            let paginationParams = super.ApplyPagination({}, options);
            if (paginationParams.take !== undefined) {
                query = query.limit(paginationParams.take);
            }
            if (paginationParams.skip !== undefined) {
                query = query.offset(paginationParams.skip);
            }
    
            if (options && typeof options.Offset === "string") {
                let operator = null;
                if (options.Offset[0] == "-") {
                    operator = " < ";
                } else if (options.Offset[0] == "+") {
                    operator = " > ";
                }
                if (operator) {
                    query = query.andWhere(
                        this.DefaultAlias +
                            "." +
                            this.GetPrimaryColumnKey() +
                            operator +
                            this.GetPrimaryColumnValue(options.Offset.substr(1))
                    );
                }
            }
            return query;
        }
    }
    
    
` ;

    return code;

};

module.exports = makeMysqlRepository;

