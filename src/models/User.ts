export class User {

    id: number;
    username: string;
    password: string;
    first: string;
    last: string;
    userRole: string;
    

    constructor(id: number,un: string, pw: string, fn: string, ln: string, role: string){
    	this.id = id;
    	this.username = un;
    	this.password = pw;
    	this.first = fn;
    	this.last = ln;
    	this.userRole = role;
    }
}