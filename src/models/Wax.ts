export class Wax{

    productID:number;
    brand: string;
    productName: string;
    productPrice: number;
    limitedEdition: boolean;
    scentCategory: string;
    scentStrength: number;
    scentDescription: string;

    constructor(id:number, name: string, brand: string, scentCategory: string ,price: number, limited: boolean, scentStrength?: number, description?: string){
        this.productID = id;
        this.productName = name;
        this.brand = brand;
        this.scentCategory = scentCategory;
        this.productPrice = price;
        this.limitedEdition = limited;
        this.scentStrength = scentStrength;
        this.scentDescription = description;
    }
}