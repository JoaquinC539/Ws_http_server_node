import {  Message, Register, ServRes } from "./types/ServRes";
import { WebCommand } from "./types/WebCommand";

console.log("Hello world")
const locationHost="localhost:4682"
const wsUrl=`ws://${locationHost}`;
const apiUrl=`http://${locationHost}/api`;
// =========== WEBSOCKET CHAT

let chat1log="";
const socket = new WebSocket(wsUrl)
const chat1logp:HTMLParagraphElement=document.getElementById("f1ChatLog") as HTMLParagraphElement;
let idregistered:string;
socket.binaryType= "arraybuffer";
document.getElementById("firstChatbox")?.addEventListener("change",(e)=>{
    if(((e.target as HTMLInputElement)?.name  )==="type"){
        if((e.target as HTMLInputElement)?.value==="priv"){            
            document.getElementById("idConts")?.removeAttribute("hidden");
            document.getElementById("userIdmi")?.removeAttribute("disabled");
        }else{
            document.getElementById("idConts")?.setAttribute("hidden","true");
            document.getElementById("userIdmi")?.setAttribute("disabled","true");
        }
    }
})
socket.addEventListener("open",(event)=>{
    console.log("Connected to server");
    socket.send(JSON.stringify({type:"serv",content:"Hello server"}) )
});

socket.addEventListener("message",(event)=>{
    
    if(typeof event.data ==="string"){
        const servRes:ServRes=JSON.parse(event.data);

        
        if(servRes.type==="welcome"){
            (document.getElementById("idCont") as HTMLSpanElement).innerText=(servRes as Register).id;
            idregistered=(servRes as Register).id
        }
        if(servRes.type==="message"){
            chat1log+="\n "+(servRes as Message).res;
            chat1logp.innerText=chat1log;
        }
        return; 
    }
    
    
       
})
socket.addEventListener("error",err=>{
    console.error("Websocker error: ",err);
})
socket.addEventListener("close",()=>{
    console.log("connetion closed");
})

const f1=document.getElementById("firstChatbox") as HTMLFormElement;
if(f1!==null){
    f1.addEventListener("submit",(e)=>{    
        e.preventDefault();    
        const message:string = (f1.elements.namedItem("mes") as HTMLInputElement).value;
        const type:string = (f1.elements.namedItem("type") as HTMLInputElement).value;    
        (f1.elements.namedItem("mes") as HTMLInputElement).value = "";
        switch(type){
            case "serv":
                sendMessageServ(message);
                break;
            case "broad":
                sendMessageBroadcast(message);
                break;
            case "priv":

                sendMessagePriv(message,(f1?.elements.namedItem("userIdm") as HTMLInputElement).value)
                break;
            default:
                sendMessageServ(message);
        }
        
    });
}
function sendMessageServ(message:string){
    socket.send(JSON.stringify(({type:"serv",content:message} as WebCommand)));
}
function sendMessageBroadcast(message:string){
    socket.send(JSON.stringify(({type:"broad",content:message,"from":idregistered} as WebCommand)));
}
function sendMessagePriv(message:string,id:string){    
    socket.send(JSON.stringify(({type:"priv",content:message,id,"from":idregistered,"to":id}as WebCommand)));
}
// =====================VIDEO HTTP =========

function getImage(){
fetch(`${apiUrl}/img`)
.then(r=>r.blob())
.then(b=>{
    console.log(b); //Blob
    const url = URL.createObjectURL(b);
    const imgElem=document.getElementById("imgServ") as HTMLImageElement;
    imgElem.hidden=false
    imgElem.src=url
    })
}
function enableVideoSR(){
    const videoElem=document.getElementById("videoServS") as HTMLVideoElement;
    videoElem.hidden=false;
    videoElem.src=`${apiUrl}/videoSC`;
    (document.getElementById("askvidS") as HTMLButtonElement)!.disabled=true;
}
function enableVideo(){
    const videoElem=document.getElementById("videoServ") as HTMLVideoElement;
    videoElem.hidden=false;
    videoElem.src=`${apiUrl}/videoSCR`;
    (document.getElementById("askvid") as HTMLButtonElement)!.disabled=true;
}
function enableVideoHls(){
    const videoElem=document.getElementById("videoHls") as HTMLVideoElement;
    videoElem.hidden=false;
    
    if(window.Hls.isSupported()){
        const hls = new window.Hls();
        hls.loadSource(`${apiUrl}/videoHls/playlist.m3u8`);
        hls.attachMedia(videoElem);
        
    }else if(videoElem.canPlayType("application/vnd.apple.mpegurl")){
        videoElem.src=`${apiUrl}/videoHls/playlist.m3u8`;
    }

    (document.getElementById("askvidHls") as HTMLButtonElement)!.disabled=true;
}
window.askImage=()=>{
    getImage();
}
window.askVideoNoRange=()=>{
    enableVideoSR()
}
window.askVideo=()=>{
    enableVideo()
}
window.askvideoHls=()=>{
    enableVideoHls();
}