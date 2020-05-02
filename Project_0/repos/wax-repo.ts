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
import { mapWaxResultSet } from '../util/result-set-mapper';

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
        }catch (e) {
            throw new InternalServerError();
        }finally {
            client && client.release();
        }
    }

    async getByID(id: number): Promise<Wax> {

        let client: PoolClient;

        try {
            client = await connectionPool.connect();
            let sql = `${this.baseQuery} where w.id = $1`;
            let rs = await client.query(sql, [id]);
            return mapWaxResultSet(rs.rows[0])
        }catch (e) {
            throw new InternalServerError();
        }finally {
            client && client.release();
        }
    }

    async getWaxByUniqueKey(key: string, val: string): Promise<Wax> {

        let client: PoolClient;

        try {
            client = await connectionPool.connect();
            let sql = `${this.baseQuery} where u.${key} = $1`;
            let rs = await client.query(sql, [val]);
            return mapWaxResultSet(rs.rows[0]);
        } catch (e) {
            throw new InternalServerError();
        } finally {
            client && client.release();
        }
    }

    // Need to come back to this because of special circumstances of saving waxes.
    // async save(newWax: Wax): Promise<Wax> {
            
    //     let client: PoolClient;

    //     try {
    //         client = await connectionPool.connect();

    //         let roleId = (await client.query('select id from user_roles where rolename = $1', [newWax.userRole])).rows[0].id;
            
    //         let sql = `
    //             insert into users (username, first_name, last_name, user_role) 
    //             values ($1, $2, $3, $4, $5) returning id
    //         `;

    //         let rs = await client.query(sql, [newWax.productName , newWax.brandID, newWax.productPrice, newWax.limitedEdition, newWax.scentCategory, newWax.scentStrength, newWax.scentDescription]);
            
    //         newWax.productID = rs.rows[0].id;
            
    //         return newWax;

    //     } catch (e) {
    //         console.log(e);
    //         throw new InternalServerError();
    //     } finally {
    //         client && client.release();
    //     }
    // }

    //Need to think of SQL statement for this
    async update(updateWax: Wax): Promise<boolean> {

        let client: PoolClient;

        try {
            client = await connectionPool.connect();
            let sql = ``;
            let rs = await client.query(sql, []);
            return true;
        }catch (e) {
            throw new InternalServerError();
        }finally {
            client && client.release();
        }
    }

    //Need to think of SQL statement for this
    async deleteById(id: number): Promise<boolean> {

        let client: PoolClient;

        try {
            client = await connectionPool.connect();
            let sql = ``;
            let rs = await client.query(sql, []);
            return true;
        }catch (e) {
            throw new InternalServerError();
        }finally {
            client && client.release();
        }
    }
}