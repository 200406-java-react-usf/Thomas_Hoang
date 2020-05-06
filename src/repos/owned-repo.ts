import { Owned } from '../models/owned';
import { CrudRepository } from './crud-repo';
import { 
    BadRequestError, 
    ResourceNotFoundError,
    ResourcePersistenceError,
    InternalServerError
} from '../errors/errors';
import { PoolClient } from 'pg';
import { connectionPool } from '..';
import { mapOwnedResultSet } from '../util/result-set-mapper';

export class OwnedRepository implements CrudRepository<Owned> {
    
    baseQuery = `
        select
	        u.id as user_id,
	        w.id as wax_id,
	        w.product_name,
	        b.brand_name as brand_name,
	        w.category,
	        w.price,
	        w.limited_edition,
	        wo.quantity,
	        wo.personal_rating,
	        w.strength,
	        w.description
        from wax_owners wo
        full outer join users u
        on wo.user_id = u.id
        full outer join waxes w
        on wo.product_id = w.id
        inner join brands b
        on w.brand_id = b.id
    `;

    async getAll(): Promise<Owned[]> {

        let client: PoolClient;

        try{
            client = await connectionPool.connect();
            let sql = `${this.baseQuery} where user_id = $1`;
            let rs = await client.query(sql);
            return rs.rows.map(mapOwnedResultSet);
        }catch (e) {
            throw new InternalServerError();
        }finally {
            client && client.release();
        }
    }

    async getById(id: number): Promise<Owned> {

        let client: PoolClient;

        try {
            client = await connectionPool.connect();
            let sql = `${this.baseQuery} where wax_id = $1`;
            let rs = await client.query(sql, [id]);
            return mapOwnedResultSet(rs.rows[0])
        }catch (e) {
            throw new InternalServerError();
        }finally {
            client && client.release();
        }
    }

    async getWaxByUniqueKey(key: string, val: string): Promise<Owned> {

        let client: PoolClient;

        try {
            client = await connectionPool.connect();
            let sql = `${this.baseQuery} where ${key} = $1`;
            let rs = await client.query(sql, [val]);
            return mapOwnedResultSet(rs.rows[0]);
        } catch (e) {
            throw new InternalServerError();
        } finally {
            client && client.release();
        }
    }

    async save(newOwned: Owned): Promise<Owned> {
            
        let client: PoolClient;

        try {
            client = await connectionPool.connect();
            if (newOwned.wax_id != undefined){
                let sql = `
                    insert into wax_owners (user_id, product_id, quantity, personal_rating) 
                    values ($1, $2, $3, $4) returning user_id
                `;

                let rs = await client.query(sql, [newOwned.user_id, newOwned.wax_id, newOwned.quantity, newOwned.personal_rating]);
                newOwned.wax_id = rs.rows[0].id;
                return newOwned;
            }else if (newOwned.personal_rating == undefined){
                let sql = `
                    insert into wax_owners (user_id, product_id, quantity) 
                    values ($1, $2, $3) returning user_id
                `;
            
                let rs = await client.query(sql, [newOwned.user_id, newOwned.wax_id, newOwned.quantity]);
                newOwned.wax_id = rs.rows[0].id;
                return newOwned;
            }
        } catch (e) {
            console.log(e);
            throw new InternalServerError();
        } finally {
            client && client.release();
        }
    }

    async update(updatedWax: Owned): Promise<boolean> {

        let client: PoolClient;

        try {
            client = await connectionPool.connect();
            if (updatedWax.personal_rating != undefined){
                let sql = `
                    update wax_owners set (quantity, personal_rating) = ($3, $4) where (user_id, product_id) = ($1, $2);
                `;

                let rs = await client.query(sql, [updatedWax.user_id, updatedWax.wax_id, updatedWax.quantity, updatedWax.personal_rating]);
                updatedWax.wax_id = rs.rows[0].id;
                return true;
            }else if (updatedWax.personal_rating == undefined){
                let sql = `
                    update wax_owners set quantity = $3 where (user_id, product_id) = ($1, $2);
                `;
            
                let rs = await client.query(sql, [updatedWax.user_id, updatedWax.wax_id, updatedWax.quantity]);
                updatedWax.wax_id = rs.rows[0].id;
                return true;
            }
        }catch (e) {
            throw new InternalServerError();
        }finally {
            client && client.release();
        }
    }

    async deleteById(productID: number): Promise<boolean> {

        let client: PoolClient;

        try {
            client = await connectionPool.connect();
            let sql = `delete from wax_owners product_id = $2;`;
            let rs = await client.query(sql, [productID]);  
            return true;
        }catch (e) {
            throw new InternalServerError();
        }finally {
            client && client.release();
        }
    }
}