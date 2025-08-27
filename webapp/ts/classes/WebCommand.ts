export class WebCommand{
    public type: "serv" | "priv" | "broad" ;
    public content?:string;
    public from?:string;
    public to?:string

    constructor(type:"serv" | "priv" | "broad" ,content?:string,from?:string,to?:string){
        this.type=type;
        this.content=content;
        this.from=from;
        this.to=to;

    }

    public static fromJSON(json:Record<string,any>):WebCommand{
        if (!json || typeof json.type !== 'string') {
            throw new Error('Invalid JSON structure for WebCommand.');
        }
        const command= new WebCommand((json["type"] as "serv" | "priv" | "broad"))
        command.content=json["content"];
        command.from = json.from;
        command.to = json.to;
        return command;

    }

}