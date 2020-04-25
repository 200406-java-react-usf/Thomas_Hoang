export class User {

    username: string;
    first: string;
    last: string;
    //Multdimensional array to allow user to have multiple different products
    inventory: [[string, number, number]];

    constructor(un: string, fn: string, ln: string,productName:string, productQuantity: number, personalRating: number){
        this.username = un;
        this.first = fn;
        this.last = ln;
        this.inventory = [[productName, productQuantity, personalRating]];
    }
};