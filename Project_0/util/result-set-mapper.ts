import { UserSchema } from "./schemas";
import { User } from "../models/user";
import { WaxSchema } from "./schemas";
import { Wax } from "../models/wax";

export function mapUserResultSet(resultSet: UserSchema): User {
    
    if (!resultSet) {
        return {} as User;
    }

    return new User(
        resultSet.id,
        resultSet.username,
        resultSet.password,
        resultSet.first_name,
        resultSet.last_name,
        resultSet.role_name
    );
}

export function mapWaxResultSet(resultSet: WaxSchema): Wax{

    if (!resultSet) {
        return {} as Wax;
    }
    
    return new Wax(
        resultSet.id,
        resultSet.product_name,
        resultSet.brand_name,
        resultSet.category,
        resultSet.price,
        resultSet.limited_edition,
        resultSet.strength,
        resultSet.description
    );
}

export function mapOwnedResultSet(resultSet: WaxSchema): Wax{

    if (!resultSet) {
        return {} as Wax;
    }
    
    return new Wax(
        resultSet.id,
        resultSet.product_name,
        resultSet.brand_name,
        resultSet.category,
        resultSet.price,
        resultSet.limited_edition,
        resultSet.strength,
        resultSet.description
    );
}