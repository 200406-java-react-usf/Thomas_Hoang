export class Wax{

    brandID: number;
    productName: string;
    productColor: string;
    productPrice: number;
    limitedEdition: boolean;
    scentStrength: number;
    ProductDescription: string;

    constructor(brandID: number, name: string, color: string, price: number, limited: boolean, scentStrength: number, description: string){
        this.brandID = brandID
        this.productName = name;
        this.productColor = color;
        this.productPrice = price;
        this.limitedEdition = limited;
        this.scentStrength = scentStrength;
        this.ProductDescription = description;
    }
}