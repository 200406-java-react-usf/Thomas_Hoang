import { Wax } from '../models/wax';
import { CrudRepository } from './crud-repo';
import { 
    BadRequestError, 
    ResourceNotFoundError,
    ResourcePersistenceError,
    NotImplementedError,
    InternalServerError
} from '../errors/errors';
import { PoolClient } from 'pg';
import { connectionPool } from '..';
import { mapOwnedResultSet } from '../util/result-set-mapper';

export class OwnedRepository implements CrudRepository<Wax> {
    
}