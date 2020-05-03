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
    scent_category:string,
    brand_name: string,
    product_price: number,
    limited_edition: boolean,
    scent_strength: number,
    scent_description: string
}

export interface BrandSchema {
    id: number,
    brand_name: string
}