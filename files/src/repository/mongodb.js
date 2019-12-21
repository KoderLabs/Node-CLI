let code = '';

const makeMongoDbRepository = function (name) {

    code = `
    import { BaseRepository } from "./BaseRepository";
    import { BaseModel } from "../model/BaseModel";
    import { ObjectId } from "mongodb";
    import { Connection, MongoRepository } from "typeorm";
    import DatabaseLoader from "../database/DatabaseLoader";
    import { PaginationDBParams } from "../helpers/UtilHelper";
    import { SSLogger } from "../helpers/LoggerHelper";
    
    export abstract class MongoDbRepository<T extends BaseModel> extends BaseRepository<T> {
        protected PrimaryColumnKey: string = "_id";
    
        protected constructor(model) {
            super(model, "mongodb");
            this.SetRepo();
        }
    
        public async Find(whereParams, options?: PaginationDBParams): Promise<T[]> {
            let MongoRepository = this.Repository as MongoRepository<T>;
            let PipeLine: Array<any> = [];
    
            PipeLine = PipeLine.concat(
                [this.GetFilters(whereParams, options), this.GetOrder()],
                this.GetPagination(options),
                this.GetProjection()
            );
            return MongoRepository.aggregateEntity(PipeLine).toArray();
        }
    
        protected SetRepo(): void {
            this.Repository = (DatabaseLoader.GetConnection(this.ConnectionName) as Connection).getMongoRepository(this.Model);
        }
    
        protected GetPrimaryColumnValue(val) {
            if (val instanceof ObjectId) {
                return val;
            }
            return new ObjectId(val);
        }
    
        protected LessThanOperator(val) {
            return {
                $lt: val
            };
        }
    
        protected MoreThanOperator(val) {
            return {
                $gt: val
            };
        }
    
        protected InOperator(val) {
            return {
                $in: val
            };
        }
    
        protected GetOrder(orderOptions?: { Column: string; Direction: "ASC" | "DESC" }): any {
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
    
            let order: any = {
                $sort: {}
            };
            order.$sort[Column] = Direction === "DESC" ? -1 : 1;
            return order;
        }
    
        protected GetPagination(options: PaginationDBParams) {
            let Params = this.ApplyPagination({}, options);
            let Paginate = [];
    
            if (Params.skip) {
                Paginate.push({
                    $skip: Params.skip
                });
            }
            if (Params.take) {
                Paginate.push({
                    $limit: Params.take
                });
            }
            return Paginate;
        }
    
        protected GetProjection() {
            return [];
        }
    
        protected GetFilters(whereParams: any, options: PaginationDBParams) {
            return {
                $match: this.PrepareParams(whereParams, options)
            };
        }
    }
    
    
` ;

    return code;

};

module.exports = makeMongoDbRepository;

