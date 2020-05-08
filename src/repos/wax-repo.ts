import { Wax } from '../models/wax';
import { CrudRepository } from './crud-repo';
import { 
    BadRequestError, 
    ResourceNotFoundError,
    ResourcePersistenceError,
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
        on w.brand_id = b.id
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

    async getById(id: number): Promise<Wax> {

        let client: PoolClient;

        try {
            client = await connectionPool.connect();
            let sql = `${this.baseQuery}`;
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
            let sql = `${this.baseQuery} where w.${key} = $1`;
            let rs = await client.query(sql, [val]);
            return mapWaxResultSet(rs.rows[0]);
        } catch (e) {
            throw new InternalServerError();
        } finally {
            client && client.release();
        }
    }

    async save(newWax: Wax): Promise<Wax> {
            
        let client: PoolClient;

        try {
            client = await connectionPool.connect();
            let brandID = (await client.query('select id from brands where brand_name = $1', [newWax.brand])).rows[0].id;
            if (newWax.scentStrength && newWax.scentDescription){
                let sql = `
                    insert into waxes (product_name, brand_id, price, limited edition, category, strength, description) 
                    values ($1, $2, $3, $4, $5, $6, $7) returning id
                `;

                let rs = await client.query(sql, [newWax.productName, brandID , newWax.productPrice, newWax.limitedEdition, newWax.scentCategory, newWax.scentStrength, newWax.scentDescription]);
                newWax.productID = rs.rows[0].id;
                return newWax;
            }else if (newWax.scentStrength){
                let sql = `
                    insert into waxes (product_name, brand_id, price, limited edition, category, strength) 
                    values ($1, $2, $3, $4, $5, $6) returning id
                `;
            
                let rs = await client.query(sql, [newWax.productName , brandID, newWax.productPrice, newWax.limitedEdition, newWax.scentCategory, newWax.scentStrength]);
                newWax.productID = rs.rows[0].id;
                return newWax;
            }else if (newWax.scentDescription){
                let sql = `
                    insert into waxes (product_name, brand_id, price, limited edition, category, description) 
                    values ($1, $2, $3, $4, $5, $6) returning id
                `;
            
                let rs = await client.query(sql, [newWax.productName , brandID, newWax.productPrice, newWax.limitedEdition, newWax.scentCategory, newWax.scentDescription]);
                newWax.productID = rs.rows[0].id;
                return newWax;
            }else if (!newWax.scentStrength && !newWax.scentDescription){
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

    async update(updatedWax: Wax): Promise<boolean> {

        let client: PoolClient;

        try {
            client = await connectionPool.connect();

            if (updatedWax.scentStrength && updatedWax.scentDescription){
                let sql = `update waxes set strength = $2, description = $3 where id = $1;`;
                let rs = await client.query(sql, [updatedWax.productID, updatedWax.scentStrength, updatedWax.scentDescription]);
                return true;
            }else if (updatedWax.scentStrength){
                let sql = `update waxes set strength = $2 where id = $1;`;
                let rs = await client.query(sql, [updatedWax.productID, updatedWax.scentStrength]);
                return true;
            }else if (updatedWax.scentDescription){
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

    async deleteById(id: number): Promise<boolean> {

        let client: PoolClient;

        try {
            client = await connectionPool.connect();
            let sql = `delete from waxes where id = $1;`;
            await client.query(sql, [id]);
            return true;
        }catch (e) {
            throw new InternalServerError();
        }finally {
            client && client.release();
        }
    }
}