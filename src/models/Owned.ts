export class Owned{

    user_id: number;
    wax_id:number;
    brand_name: string;
    product_name: string;
    price: number;
    limited_edition: boolean;
    category: string;
    quantity: number;
    personal_rating: number;
    strength: number;
    description: string;
    constructor(userID: number, productID:number, name: string, brand: string, scentCategory: string,price: number, limited: boolean, quantity: number, personalRating?: number, scentStrength?: number , description?: string){
    	this.user_id = userID;
    	this.wax_id = productID;
    	this.product_name = name;
    	this.brand_name = brand;
    	this.category = scentCategory;
    	this.price = price;
    	this.limited_edition = limited;
    	this.quantity = quantity;
    	this.personal_rating = personalRating;
    	this.strength = scentStrength;
    	this.description = description;
    }
}