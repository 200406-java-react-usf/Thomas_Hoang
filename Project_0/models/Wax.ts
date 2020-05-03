export class Wax{

    productID:number;
    brand: string;
    productName: string;
    productPrice: number;
    limitedEdition: boolean;
    scentCategory: string;
    scentStrength: number;
    scentDescription: string;

    constructor(id:number, brand: string, name: string, price: number, limited: boolean,scentCategory: string, scentStrength?: number, description?: string){
        this.productID = id;
        this.brand = brand;
        this.productName = name;
        this.productPrice = price;
        this.limitedEdition = limited;
        this.scentCategory = scentCategory;
        this.scentStrength = scentStrength;
        this.scentDescription = description;
    }
}