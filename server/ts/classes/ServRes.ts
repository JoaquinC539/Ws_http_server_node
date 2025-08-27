export interface ServRes{
    type:string;

}
export interface IRegister extends ServRes{
    type:"welcome";
    id:string
}
export interface IMessage extends ServRes{
    type:"message";
    res:string;
}
export class ServerResponse implements ServRes{
    public type:string;    
    constructor(type:string){
        this.type=type;
    }
}
export class Register extends ServerResponse implements IRegister {
    public type: "welcome";
    public id: string
    constructor(id:string){
        super("welcome")
        this.type="welcome";
        this.id=id
    }
}
export class Message extends ServerResponse implements IMessage{
    public type: "message";
    res: string;
    constructor(res:string){
        super("message")
        this.type="message";
        this.res=res;
    }


}