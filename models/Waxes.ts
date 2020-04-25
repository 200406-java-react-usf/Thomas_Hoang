export class Wax{

    productName: string;
    productColor: string;
    productPrice: number;
    limitedEdition: boolean;
    scentStrength: number;
    ProductDescription: string;

    constructor(name: string, color: string, price: number, limited: boolean, scentStrength: number, description: string){
        this.productName = name;
        this.productColor = color;
        this.productPrice = price;
        this.limitedEdition = limited;
        this.scentStrength = scentStrength;
        this.ProductDescription = description;
    }
}