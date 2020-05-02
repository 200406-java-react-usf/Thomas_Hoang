export interface UserSchema {
    id: number,
    username: string,
    first_name: string,
    last_name: string,
    role_name: string
}

export interface WaxSchema {
    id: number,
    product_name: string,
    brand_id: number,
    product_price: number,
    limited_edition: string,
    scent_strength: number,
    scent_description: string
}

export interface BrandSchema {
    id: number,
    brand_name: string
}