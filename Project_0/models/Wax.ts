export class Wax{

    productID:number;
    brandID: number;
    productName: string;
    productPrice: number;
    limitedEdition: boolean;
    scentCategory: string;
    scentStrength: number;
    scentDescription: string;

    constructor(id:number, brandID: number, name: string, price: number, limited: boolean,scentCategory: string, scentStrength?: number, description?: string){
        this.productID = id;
        this.brandID = brandID;
        this.productName = name;
        this.productPrice = price;
        this.limitedEdition = limited;
        this.scentCategory = scentCategory;
        this.scentStrength = scentStrength;
        this.scentDescription = description;
    }
}