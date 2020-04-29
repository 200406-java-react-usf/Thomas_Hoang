export class Wax{

    brandID: number;
    productName: string;
    productPrice: number;
    limitedEdition: boolean;
    scentStrength: number;
    ProductDescription: string;

    constructor(brandID: number, name: string, price: number, limited: boolean, scentStrength?: number, description?: string){
        this.brandID = brandID
        this.productName = name;
        this.productPrice = price;
        this.limitedEdition = limited;
        this.scentStrength = scentStrength;
        this.ProductDescription = description;
    }
}