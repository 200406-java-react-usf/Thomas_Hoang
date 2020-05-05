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
            let sql = `${this.baseQuery} where u.${key} = $1`;
            let rs = await client.query(sql, [val]);
            return mapOwnedResultSet(rs.rows[0]);
        } catch (e) {
            throw new InternalServerError();
        } finally {
            client && client.release();
        }
    }

    async save(newWax: Owned): Promise<Owned> {
            
        let client: PoolClient;

        try {
            client = await connectionPool.connect();
            let brandID = (await client.query('select id from brands where brand_name = $1', [newWax.brand])).rows[0].id;
            if (newWax.scentStrength != undefined && newWax.scentDescription != undefined){
                let sql = `
                    insert into waxes (product_name, brand_id, price, limited edition, category, strength, description) 
                    values ($1, $2, $3, $4, $5, $6, $7) returning id
                `;

                let rs = await client.query(sql, [newWax.productName, brandID , newWax.productPrice, newWax.limitedEdition, newWax.scentCategory, newWax.scentStrength, newWax.scentDescription]);
                newWax.productID = rs.rows[0].id;
                return newWax;
            }else if (newWax.scentStrength != undefined){
                let sql = `
                    insert into waxes (product_name, brand_id, price, limited edition, category, strength) 
                    values ($1, $2, $3, $4, $5, $6) returning id
                `;
            
                let rs = await client.query(sql, [newWax.productName , brandID, newWax.productPrice, newWax.limitedEdition, newWax.scentCategory, newWax.scentStrength]);
                newWax.productID = rs.rows[0].id;
                return newWax;
            }else if (newWax.scentDescription != undefined){
                let sql = `
                    insert into waxes (product_name, brand_id, price, limited edition, category, description) 
                    values ($1, $2, $3, $4, $5, $6) returning id
                `;
            
                let rs = await client.query(sql, [newWax.productName , brandID, newWax.productPrice, newWax.limitedEdition, newWax.scentCategory, newWax.scentDescription]);
                newWax.productID = rs.rows[0].id;
                return newWax;
            }else if (newWax.scentStrength == undefined && newWax.scentDescription == undefined){
                let sql = `
                    insert into waxes (product_name, brand_id, price, limited edition, category) 
                    values ($1, $2, $3, $4, $5) returning id
                `;
    
                let rs = await client.query(sql, [newWax.productName , brandID, newWax.productPrice, newWax.limitedEdition, newWax.scentCategory]);
                newWax.productID = rs.rows[0].id;
                return newWax;
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

            if (updatedWax.scentStrength != undefined && updatedWax.scentDescription != undefined){
                let sql = `update waxes set strength = $2, description = $3 where id = $1;`;
                let rs = await client.query(sql, [updatedWax.productID, updatedWax.scentStrength, updatedWax.scentDescription]);
                return true;
            }else if (updatedWax.scentStrength != undefined){
                let sql = `update waxes set strength = $2 where id = $1;`;
                let rs = await client.query(sql, [updatedWax.productID, updatedWax.scentStrength]);
                return true;
            }else if (updatedWax.scentDescription != undefined){
                let sql = `update waxes set description = $2 where id = $1;`;
                let rs = await client.query(sql, [updatedWax.productID, updatedWax.scentDescription]);
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
            let userID = (await client.query('select id from users where id = $1', [user.userID])).rows[0].id;
            let sql = `delete from wax_owners where user_id = $1 and product_id = $2;`;
            let rs = await client.query(sql, [userID, productID]);  
            return true;
        }catch (e) {
            throw new InternalServerError();
        }finally {
            client && client.release();
        }
    }
}