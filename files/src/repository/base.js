let code = '';

const makeBaseRepository = function (name) {

    code = `
    import { Connection, DeepPartial, In, IsNull, LessThan, MoreThan, ObjectType, Repository, UpdateResult } from "typeorm";
    import { BaseModel } from "../model/BaseModel";
    import DatabaseLoader from "../database/DatabaseLoader";
    import { PaginationDBParams } from "../helpers/UtilHelper";
    
    export abstract class BaseRepository<T extends BaseModel> {
        protected Repository: Repository<any>;
        protected Model: ObjectType<T>;
        protected ConnectionName: string;
        protected DefaultOrderByColumn: string = "CreatedAt";
        protected DefaultOrderByDirection: string = "ASC";
        protected PrimaryColumnKey: string = "Id";
    
        protected constructor(model, connectionName) {
            this.Model = model;
            this.ConnectionName = connectionName;
            this.Repository = (DatabaseLoader.GetConnection(this.ConnectionName) as Connection).getRepository(this.Model);
        }
    
        protected SetRepo(): void {}
    
        /**
         *  Returns new instance
         * @param {T} instance
         * @returns {Promise<T extends BaseModel>}
         */
        public async Create(instance: T): Promise<T> {
            return await this.Save(instance);
        }
    
        public async Reload(instance: T): Promise<T> {
            return this.Repository.findOne(this.Repository.getId(instance));
        }
    
        public async FindOne(whereParams): Promise<T> {
            let records: Array<T> = await this.Find(whereParams);
            return records[0] ? records[0] : null;
        }
    
        public async Find(whereParams, options?: PaginationDBParams): Promise<T[]> {
            let params = {
                where: this.PrepareParams(whereParams)
            };
            params = this.ApplyProjection(params);
            params = this.ApplyPagination(params, options);
            params = this.ApplyOrder(params);
            return this.Repository.find(params);
        }
    
        public async FindAll(options?: PaginationDBParams): Promise<T[]> {
            return this.Find({}, options);
        }
    
        protected PrepareParams(whereParams, options?: PaginationDBParams) {
            let whereClauses = {};
            for (let key in whereParams) {
                let val = whereParams[key];
    
                if (key[0] === "$") {
                    // do nothing
                } else if (Array.isArray(val)) {
                    val = this.InOperator(val);
                } else if (val === null) {
                    val = IsNull();
                }
    
                whereClauses[key] = val;
            }
            whereClauses["DeletedAt"] = 0;
    
            // TODO: best approach to do this
            if (options && typeof options.Offset === "string" && !whereClauses[this.GetPrimaryColumnKey()]) {
                let func = null;
                if (options.Offset[0] == "-") {
                    func = this.LessThanOperator;
                } else if (options.Offset[0] == "+") {
                    func = this.MoreThanOperator;
                }
                if (func) {
                    whereClauses[this.GetPrimaryColumnKey()] = func(this.GetPrimaryColumnValue(options.Offset.substr(1)));
                }
            }
            return whereClauses;
        }
    
        public async Save(instance: T): Promise<T> {
            return (await this.Repository.save(this.SetTimestamps(instance) as DeepPartial<BaseModel>)) as T;
        }
    
        public async Delete(param: any): Promise<UpdateResult> {
            return await this.Repository.update(param, {
                DeletedAt: Date.now()
            } as any);
        }
    
        public async DeleteById(id: number): Promise<UpdateResult> {
            return await this.Delete({
                Id: id
            });
        }
    
        public async BatchCreate(data: Array<Partial<T>>) {
            data = data.map(obj => {
                return this.SetTimestamps(obj as T);
            });
            return await this.Repository.createQueryBuilder()
                .insert()
                .into(this.Model)
                .values(data as any)
                .execute();
        }
    
        public async FindById(id: number): Promise<T> {
            let Param: any = {};
            Param[this.GetPrimaryColumnKey()] = this.GetPrimaryColumnValue(id);
            return await this.FindOne(Param);
        }
    
        public async Update(selection, update) {
            update.UpdateAt = Date.now();
            await this.Repository.update(selection, update);
        }
    
        protected ApplyPagination(whereParams: any, options?: PaginationDBParams): any {
            let Limit = 10;
            let Offset = 0;
    
            if (options) {
                if (typeof options.Offset == "number") {
                    Offset = options.Offset;
                }
                if (options.Limit) {
                    Limit = options.Limit;
                }
            }
            if (Limit != -1 && options !== undefined) {
                whereParams.take = Limit;
                whereParams.skip = Offset;
            }
            return whereParams;
        }
    
        // TODO: discuss this methods cases
        protected SetTimestamps(obj: T): T {
            if (obj.CreatedAt === undefined) {
                obj.CreatedAt = Date.now();
            }
    
            obj.UpdatedAt = Date.now();
    
            if (obj.DeletedAt === undefined) {
                obj.DeletedAt = 0;
            }
            return obj;
        }
    
        protected GetPrimaryColumnValue(val) {
            return val;
        }
    
        protected GetPrimaryColumnKey() {
            return this.PrimaryColumnKey;
        }
    
        protected ApplyOrder(whereParams: any, orderOptions?: { Column: string; Direction: "ASC" | "DESC" }): any {
            let Column: string = this.DefaultOrderByColumn;
            let Direction: string = this.DefaultOrderByDirection;
    
            if (orderOptions !== undefined) {
                if (orderOptions.Column) {
                    Column = orderOptions.Column;
                }
    
                if (orderOptions.Direction) {
                    Direction = orderOptions.Direction;
                }
            }
    
            if (whereParams.order === undefined) {
                whereParams.order = {};
            }
    
            whereParams.order[Column] = Direction;
    
            return whereParams;
        }
    
        protected ApplyProjection(whereParams: any) {
            return whereParams;
        }
    
        protected LessThanOperator(val: any): any {
            return LessThan(val);
        }
    
        protected MoreThanOperator(val): any {
            return MoreThan(val);
        }
    
        protected InOperator(val): any {
            return In(val);
        }
    }
    
    
` ;

    return code;

};

module.exports = makeBaseRepository;

