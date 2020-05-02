import { UserSchema } from "./schemas";
import { User } from "../models/user";

export function mapUserResultSet(resultSet: UserSchema): User {
    
    if (!resultSet) {
        return {} as User;
    }

    return new User(
        resultSet.id,
        resultSet.username,
        resultSet.first_name,
        resultSet.last_name,
        resultSet.role_name
    );
}