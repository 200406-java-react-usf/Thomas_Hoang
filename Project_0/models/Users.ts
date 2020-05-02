export class User {

    userID: number;
    username: string;
    first: string;
    last: string;
    userRole: number;

    constructor(id: number,un: string, fn: string, ln: string, role: number){
        this.userID = id;
        this.username = un;
        this.first = fn;
        this.last = ln;
        this.userRole = role;
    }
};