export class User {

    username: string;
    first: string;
    last: string;
    //Multdimensional array to allow user to have multiple different products
    inventory: [[number, number]];

    constructor(un: string, fn: string, ln: string, productID: number, productQuantity: number){
        this.username = un;
        this.first = fn;
        this.last = ln;
        this.inventory = [[productID, productQuantity]];
    }
};