import { EntityTarget } from "typeorm/common/EntityTarget";
import { ObjectLiteral } from "typeorm/common/ObjectLiteral";
import { DataSourceOptions } from "typeorm/data-source/DataSourceOptions";
import { IsolationLevel } from "typeorm/driver/types/IsolationLevel";
import { ReplicationMode } from "typeorm/driver/types/ReplicationMode";
import { EntityManager } from "typeorm/entity-manager/EntityManager";
import { MongoEntityManager } from "typeorm/entity-manager/MongoEntityManager";
import { SqljsEntityManager } from "typeorm/entity-manager/SqljsEntityManager";
import { EntityMetadata } from "typeorm/metadata/EntityMetadata";
import { Migration } from "typeorm/migration/Migration";
import { SelectQueryBuilder } from "typeorm/query-builder/SelectQueryBuilder";
import { QueryRunner } from "typeorm/query-runner/QueryRunner";
import { MongoRepository } from "typeorm/repository/MongoRepository";
import { Repository } from "typeorm/repository/Repository";
import { TreeRepository } from "typeorm/repository/TreeRepository";

interface IDatabase {
    manager: EntityManager 
    get isConnected(): boolean;
    get mongoManager(): MongoEntityManager;
    get sqljsManager(): SqljsEntityManager;

    setOptions(options: Partial<DataSourceOptions>): this;
    initialize(): Promise<this>;
    destroy(): Promise<void>;
    synchronize(dropBeforeSync?: boolean): Promise<void>;
    dropDatabase(): Promise<void>;
    runMigrations(options?: { transaction?: "all" | "none" | "each"; fake?: boolean }): Promise<Migration[]>;
    undoLastMigration(options?: { transaction?: "all" | "none" | "each"; fake?: boolean }): Promise<void>;
    showMigrations(): Promise<boolean>;
    hasMetadata(target: EntityTarget<any>): boolean;
    getMetadata(target: EntityTarget<any>): EntityMetadata;
    getRepository<Entity extends ObjectLiteral>(target: EntityTarget<Entity>): Repository<Entity>;
    getTreeRepository<Entity extends ObjectLiteral>(target: EntityTarget<Entity>): TreeRepository<Entity>;
    getMongoRepository<Entity extends ObjectLiteral>(target: EntityTarget<Entity>): MongoRepository<Entity>;
    transaction<T>(runInTransaction: (entityManager: EntityManager) => Promise<T>): Promise<T>;
    transaction<T>(isolationLevel: IsolationLevel, runInTransaction: (entityManager: EntityManager) => Promise<T>): Promise<T>;
    query<T = any>(query: string, parameters?: any[], queryRunner?: QueryRunner): Promise<T>;
    createQueryBuilder<Entity extends ObjectLiteral>(entityClass: EntityTarget<Entity>, alias: string, queryRunner?: QueryRunner): SelectQueryBuilder<Entity>;
    createQueryBuilder(queryRunner?: QueryRunner): SelectQueryBuilder<any>;
    createQueryRunner(mode?: ReplicationMode): QueryRunner;
    getManyToManyMetadata(entityTarget: EntityTarget<any>, relationPropertyPath: string): EntityMetadata | undefined;
    createEntityManager(queryRunner?: QueryRunner): EntityManager;
    defaultReplicationModeForReads(): ReplicationMode;
}

export default IDatabase;