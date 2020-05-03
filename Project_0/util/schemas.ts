export interface UserSchema {
    id: number,
    username: string,
    password: string,
    first_name: string,
    last_name: string,
    role_name: string
}

export interface WaxSchema {
    id: number,
    product_name: string,
    brand_name: string,
    category:string,
    price: number,
    limited_edition: boolean,
    strength: number,
    description: string
}

export interface OwnedSchema {
    wax_id: number,
    product_name: string,
    brand_name: string,
    category:string,
    price: number,
    limited_edition: boolean,
    quantity: number,
    personal_rating: number,
    strength: number,
    description: string
}

export interface BrandSchema {
    id: number,
    brand_name: string
}