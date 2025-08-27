import WebSocket, { Server } from "ws";

// const {v4: uuidv4}= require("uuid");
import { v4 as  uuidv4} from "uuid";
import { WebCommand } from "./classes/WebCommand";
import { Message, Register, ServerResponse } from "./classes/ServRes";
import { json } from "body-parser";
export class WssActions{

    private wss:Server;
    private clients: Map<string,WebSocket>

    constructor(ws:Server){
        this.wss=ws;
        this.clients=new Map();
    }
    public setWssEvents():void{
        this.wss.addListener("connection",ws=>{
            const id=uuidv4();
           this.setWsConnectionSetup(ws,id);
           this.setWsMessageHandling(ws,id);
           this.setWsCloseHandling(ws,id);
        });
    }

    private setWsConnectionSetup(ws:WebSocket,id:string):void{            
        console.log("Client connected with id: ",id);
        this.clients.set(id,ws)        
        ws.send(JSON.stringify(new Register(id)));
    } 
    private setWsMessageHandling(ws:WebSocket,id:string):void{
        ws.on("message",(message:string)=>{
            const obj=JSON.parse(message);
            const command=WebCommand.fromJSON(obj);
            command.from=id;
            switch (command.type){
                case "serv":
                 ws.send(JSON.stringify(new Message(`Server echo: ${command.content}`)));
                break;
                case "broad":                
                    this.wss.clients.forEach(client=>{
                        if(client.readyState===WebSocket.OPEN){
                            client.send(JSON.stringify(new Message(`Broadcast Message from ${command.from}: ${command.content}`)))
                        }
                    })
                    break;
                case "priv":  
                const target  = this.clients.get(command.to as string);
                if(target && target.readyState === WebSocket.OPEN){                    
                    target.send(JSON.stringify(new Message(`Private Message from ${command.from}: ${command.content}`)));
                }
                break;
            default:
                 ws.send(JSON.stringify(new Message(`Server: ${obj["content"]}`)) )
            }
            
        })

    }
    private setWsCloseHandling(ws:WebSocket,id:string):void{
        ws.on("close",()=>{
            this.clients.delete(id);
            console.log("Client disconnected: ",id);
        });
    }
}


