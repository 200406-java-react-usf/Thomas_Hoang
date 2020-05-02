import { Wax } from '../models/wax';
import { CrudRepository } from './crud-repo';
import { 
    BadRequestError, 
    ResourceNotFoundError,
    ResourcePersistenceError,
    NotImplementedError
} from '../errors/errors';
import { PoolClient } from 'pg';
import { connectionPool } from '..';
import { mapUserResultSet } from '../util/result-set-mapper';

export class WaxRepository implements CrudRepository<Wax> {
    
    baseQuery = `
        select
            w.id,
            w.product_name,
            b.brand_name as brand_name,
            w.category,
            w.price,
            w.limited_edition,
            w.strength,
            w.description
        from waxes w
        join brands b
        on w.brand_id = b.brand_name
    `;

    async getAll(): Promise<Wax[]> {

        let client: PoolClient;

        try{
            client = await connectionPool.connect();
            let sql = `${this.baseQuery}`;
            let rs = await client.query(sql);
            return rs.rows.map(mapWaxResultSet);
        }
    }

}