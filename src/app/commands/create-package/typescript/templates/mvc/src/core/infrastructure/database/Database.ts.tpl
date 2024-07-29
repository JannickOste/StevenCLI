import { DataSource, DataSourceOptions, Driver, EntityManager, EntityMetadata, EntityTarget,  Migration, MongoEntityManager, MongoRepository, NamingStrategyInterface, ObjectLiteral, QueryRunner, ReplicationMode, Repository, SelectQueryBuilder, TreeRepository } from "typeorm";
import IDatabase from "../../domain/database/IDatabase";
import { injectable } from "inversify";
import { MysqlConnectionOptions } from "typeorm/driver/mysql/MysqlConnectionOptions";
import { AuroraMysqlConnectionOptions } from "typeorm/driver/aurora-mysql/AuroraMysqlConnectionOptions";
import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";
import { QueryResultCache } from "typeorm/cache/QueryResultCache";
import { IsolationLevel } from "typeorm/driver/types/IsolationLevel";
import { SqljsEntityManager } from "typeorm/entity-manager/SqljsEntityManager";
import { MongoDriver } from "typeorm/driver/mongodb/MongoDriver";
import { SqljsDriver } from "typeorm/driver/sqljs/SqljsDriver";
import path = require("path");
import CONSTANTS from "../../../CONSTANTS";


type DatabaseType = "mysql" | "mariadb" | "postgres" | "cockroachdb" | "sqlite" | "mssql" | "sap" | "oracle" | "mongodb" | "sqljs" | "aurora-mysql" | "aurora-postgres" | "spanner";


@injectable()
export default class Database implements IDatabase {
    private readonly dataSource: DataSource;
    private readonly entityGlobPattern =  path.join(CONSTANTS.ROOT, '**', 'domain', 'models', '*.{ts,js}').replace(/\\/g, '/');

    constructor() {
        this.dataSource = new DataSource(this.getDataSourceOptions());
    }

    private getDataSourceOptions(): DataSourceOptions {
        const type = process.env.DATABASE_TYPE as DatabaseType;
        if (!type) {
            throw new Error("DATABASE_TYPE is not defined or invalid.");
        }

        const commonOptions: Partial<DataSourceOptions> = {
            host: process.env.DATABASE_HOST,
            port: parseInt(process.env.DATABASE_PORT ?? "", 10),
            username: process.env.DATABASE_USER,
            password: process.env.DATABASE_PASS,
            database: process.env.DATABASE_DB,
            synchronize: process.env.DATABASE_SYNC === "true",
            logging: process.env.DATABASE_LOG === "true",
            entities: [this.entityGlobPattern],
            migrations: [],
            subscribers: [],
        };

        return this.getSpecificOptions(type, commonOptions);
    }

    private getSpecificOptions(type: DatabaseType, commonOptions: Partial<DataSourceOptions>): DataSourceOptions {
        switch (type) {
            case "aurora-mysql":
                return {
                    ...commonOptions,
                    type: "aurora-mysql",
                    region: process.env.AWS_REGION!,
                    secretArn: process.env.AWS_SECRET_ARN!,
                    resourceArn: process.env.AWS_RESOURCE_ARN!,
                } as AuroraMysqlConnectionOptions;
            case "mysql":
                return  {
                    ...commonOptions,
                    type: "mysql",
                } as MysqlConnectionOptions
            case "postgres":
                return {
                    ...commonOptions,
                    type: "postgres",
                } as PostgresConnectionOptions
            default: return commonOptions as DataSourceOptions;
        }
        
    }

    /** proxies */
    get manager(): EntityManager 
    {
        return this.dataSource.manager;
    }

     get isConnected(): boolean {
         return this.dataSource.isInitialized;
     }
 
     get mongoManager(): MongoEntityManager {
         if (this.dataSource.driver instanceof MongoDriver) {
             return this.dataSource.mongoManager;
         }
         throw new Error("MongoDB is not supported with this connection.");
     }
 
     get sqljsManager(): SqljsEntityManager {
         if (this.dataSource.driver instanceof SqljsDriver) {
             return this.dataSource.sqljsManager;
         }
         throw new Error("SQL.js is not supported with this connection.");
     }
 
     setOptions(options: Partial<DataSourceOptions>): this {
         this.dataSource.setOptions(options);
         return this;
     }
 
     async initialize(): Promise<this> {
         await this.dataSource.initialize();

         return this;
     }
 
 
     async destroy(): Promise<void> {
         await this.dataSource.destroy();
     }
 
     async synchronize(dropBeforeSync?: boolean): Promise<void> {
         await this.dataSource.synchronize(dropBeforeSync);
     }
 
     async dropDatabase(): Promise<void> {
         await this.dataSource.dropDatabase();
     }
 
     async runMigrations(options?: { transaction?: "all" | "none" | "each"; fake?: boolean; }): Promise<Migration[]> {
         return await this.dataSource.runMigrations(options);
     }
 
     async undoLastMigration(options?: { transaction?: "all" | "none" | "each"; fake?: boolean; }): Promise<void> {
         await this.dataSource.undoLastMigration(options);
     }
 
     async showMigrations(): Promise<boolean> {
         return await this.dataSource.showMigrations();
     }
 
     hasMetadata(target: EntityTarget<any>): boolean {
         return this.dataSource.hasMetadata(target);
     }
 
     getMetadata(target: EntityTarget<any>): EntityMetadata {
         return this.dataSource.getMetadata(target);
     }
 
     getRepository<Entity extends ObjectLiteral>(target: EntityTarget<Entity>): Repository<Entity> {
         return this.dataSource.getRepository(target);
     }
 
     getTreeRepository<Entity extends ObjectLiteral>(target: EntityTarget<Entity>): TreeRepository<Entity> {
         return this.dataSource.getTreeRepository(target);
     }
 
     getMongoRepository<Entity extends ObjectLiteral>(target: EntityTarget<Entity>): MongoRepository<Entity> {
        return this.dataSource.getMongoRepository(target);
     }
 
     transaction<T>(runInTransaction: (entityManager: EntityManager) => Promise<T>): Promise<T>;
     transaction<T>(isolationLevel: IsolationLevel, runInTransaction: (entityManager: EntityManager) => Promise<T>): Promise<T>;
     transaction(isolationLevel: unknown, runInTransaction?: unknown): Promise<unknown> | Promise<unknown> {
         if (typeof isolationLevel === "function") {
             return this.dataSource.transaction(isolationLevel as (entityManager: EntityManager) => Promise<unknown>);
         }

         return this.dataSource.transaction(isolationLevel as IsolationLevel, runInTransaction as (entityManager: EntityManager) => Promise<unknown>);
     }
 
     query<T = any>(query: string, parameters?: any[], queryRunner?: QueryRunner): Promise<T> {
         return this.dataSource.query(query, parameters, queryRunner);
     }
 
     createQueryBuilder<Entity extends ObjectLiteral>(entityClass: EntityTarget<Entity>, alias: string, queryRunner?: QueryRunner): SelectQueryBuilder<Entity>;
     createQueryBuilder(queryRunner?: QueryRunner): SelectQueryBuilder<any>;
     createQueryBuilder(entityClass?: unknown, alias?: unknown, queryRunner?: unknown): SelectQueryBuilder<any> {
         return this.dataSource.createQueryBuilder(entityClass as EntityTarget<any>, alias as string, queryRunner as QueryRunner);
     }
 
     createQueryRunner(mode?: ReplicationMode): QueryRunner {
         return this.dataSource.createQueryRunner(mode);
     }
 
     getManyToManyMetadata(entityTarget: EntityTarget<any>, relationPropertyPath: string): EntityMetadata | undefined {
         return this.dataSource.getManyToManyMetadata(entityTarget, relationPropertyPath);
     }
 
     createEntityManager(queryRunner?: QueryRunner): EntityManager {
         return this.dataSource.createEntityManager(queryRunner);
     }
 
     defaultReplicationModeForReads(): ReplicationMode {
         return this.dataSource.defaultReplicationModeForReads();
     }
 
     getDriver(): Driver {
         return this.dataSource.driver;
     }
 
     getMetadataTableName(): string {
         return this.dataSource.metadataTableName;
     }
 
     getQueryResultCache(): QueryResultCache | undefined {
         return this.dataSource.queryResultCache;
     }
 
     getNamingStrategy(): NamingStrategyInterface {
         return this.dataSource.namingStrategy;
     }
}
