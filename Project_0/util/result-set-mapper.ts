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
        resultSet.brand_name,
        resultSet.product_name,
        resultSet.product_price,
        resultSet.limited_edition,
        resultSet.scent_category,
        resultSet.scent_strength,
        resultSet.scent_description
    );
}