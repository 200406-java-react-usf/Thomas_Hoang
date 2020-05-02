export class User {

    userID: number;
    username: string;
    first: string;
    last: string;
    //Multdimensional array to allow user to have multiple different products
    inventory: [[string, number, number]];

    constructor(id: number,un: string, fn: string, ln: string, productName: string, productQuantity: number, personalRating: number){
        this.userID = id;
        this.username = un;
        this.first = fn;
        this.last = ln;
        this.inventory = [[productName, productQuantity, personalRating]];
    }
};