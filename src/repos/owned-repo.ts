import { Owned } from '../models/owned';
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
            let sql = `${this.baseQuery}`;
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
            let sql = `${this.baseQuery} where w.id = $1`;
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
            let sql = `${this.baseQuery} where w.${key} = $1`;
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
            if (newOwned.personalRating != undefined){
                let sql = `
                    insert into wax_owners (user_id, product_id, quantity, personal_rating) 
                    values ($1, $2, $3, $4) returning id
                `;

                let rs = await client.query(sql, [newOwned.userID, newOwned.productID, newOwned.quantity, newOwned.personalRating]);
                newOwned.productID = rs.rows[0].id;
                return newOwned;
            }else if (newOwned.personalRating == undefined){
                let sql = `
                    insert into wax_owners (user_id, product_id, quantity) 
                    values ($1, $2, $3) returning product_id
                `;
            
                let rs = await client.query(sql, [newOwned.userID, newOwned.productID, newOwned.quantity]);
                newOwned.productID = rs.rows[0].id;
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
            if (updatedWax.personalRating != undefined){
                let sql = `
                    insert into wax_owners (user_id, product_id, quantity, personal_rating) 
                    values ($1, $2, $3, $4) returning product_id
                `;

                let rs = await client.query(sql, [updatedWax.userID, updatedWax.productID, updatedWax.quantity, updatedWax.personalRating]);
                updatedWax.productID = rs.rows[0].id;
                return true;
            }else if (updatedWax.personalRating == undefined){
                let sql = `
                    insert into wax_owners (user_id, product_id, quantity) 
                    values ($1, $2, $3) returning product_id
                `;
            
                let rs = await client.query(sql, [updatedWax.userID, updatedWax.productID, updatedWax.quantity]);
                updatedWax.productID = rs.rows[0].id;
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