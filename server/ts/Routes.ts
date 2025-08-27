import { Request, Response, Router } from 'express';
import { Message } from './classes/Message';
import path from "path";
import fs from "fs";
import express,{ Express } from 'express';
export class Routes{
    private router: Router;
    constructor(){
        this.router=Router()
    }
    
    private getslash(req:Request,res:Response){
        const message = new Message("Hello world")
        res.status(200).json(message)
    }
    private getImage(req:Request,res:Response){
        const imgPath = path.resolve(__dirname,"..","media","surprise.jpg");
        const imgStream = fs.readFileSync(imgPath);
        res.setHeader("Content-Type","image/jpeg")
        res.status(200).send(imgStream)
    }
    private streamVideo(req:Request,res:Response){
        const videoPath = path.resolve(__dirname,"..","media","output.mp4")
        const stat= fs.statSync(videoPath);
        const fileSize=stat.size;

        // console.log("FileSize: ",fileSize);
        
        
        res.writeHead(200,{
            "Content-Type":"video/mp4",
            "Content-Length":fileSize
        })
        fs.createReadStream(videoPath).pipe(res);
        return;
    }
    private streamVideoRange(req:Request,res:Response){
        const videoPath = path.resolve(__dirname,"..","media","output.mp4")
        const stat= fs.statSync(videoPath);
        const fileSize=stat.size;
        // console.log("FileSizeR: ",fileSize);
        const range = req.headers.range;
        if(!range){
            res.writeHead(200,{
                "Content-Type":"video/mp4",
                "Content-Length":fileSize
            })
            fs.createReadStream(videoPath).pipe(res);
            return;
        }
        // Eg range val bytes=1000-
        // console.log("Range: ",range)
        const parts = range.replace(/bytes=/,"").split("-")
        const start = parseInt(parts[0],10);
        // const end = parts[1] ? parseInt(parts[1],10):fileSize-1;
        const end = Math.min(start + 3*1024*1024 - 1, fileSize - 1);
        const chunkSize= (end-start)+1;
        // console.log("R",chunkSize)
        const file = fs.createReadStream(videoPath,{start,end});

        res.writeHead(206,{
            "Content-Range": `bytes ${start}-${end}/${fileSize}`,
            "Accept-Ranges": "bytes",
            "Content-Length": chunkSize,
            "Content-Type": "video/mp4"
        })
        file.pipe(res);

    }
    public getRoutes(){   
        this.router.get("/",(req,res)=>this.getslash(req,res))
        this.router.get("/img",(req,res)=>this.getImage(req,res))
        this.router.get("/videoSC",(req,res)=>this.streamVideo(req,res))
        this.router.get("/videoSCR",(req,res)=>this.streamVideoRange(req,res))
        this.router.use("/videoHls",express.static(path.resolve(__dirname,"..","media","hls")));

        return this.router;
    }


}