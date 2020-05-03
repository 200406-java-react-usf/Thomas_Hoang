export class Owned{

    productID:number;
    brand: string;
    productName: string;
    productPrice: number;
    limitedEdition: boolean;
    scentCategory: string;
    quantity: number;
    personalRating: number;
    scentStrength: number;
    scentDescription: string;
    constructor(id:number, name: string, brand: string, scentCategory: string,price: number, limited: boolean, quantity: number, personalRating?: number, scentStrength?: number , description?: string){
        this.productID = id;
        this.productName = name;
        this.brand = brand;
        this.scentCategory = scentCategory;
        this.productPrice = price;
        this.limitedEdition = limited;
        this.quantity = quantity;
        this.personalRating = personalRating;
        this.scentStrength = scentStrength;
        this.scentDescription = description;
    }
}