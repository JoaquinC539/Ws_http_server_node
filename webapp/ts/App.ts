import express, { Express } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import Websocket from 'ws';
import http from 'http';
import { Routes } from './Routes';
import { WssActions } from './WssActions';
import path from 'path';
import { CorsConfig } from './CorsConfig';
const PORT=4682;
const app: Express = express();

const server:http.Server= http.createServer(app);

const wss= new Websocket.Server({server});

const wsa=new WssActions(wss);

wsa.setWssEvents();

app.use(cors(CorsConfig.getCorsOptions()));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname,"..","/browser/static") ));
const routes = new Routes();
app.use("/api",routes.getRoutes())
app.use("/",(req,res)=>{
    res.setHeader("Content-Type","text/html").sendFile(path.join(__dirname,"..","browser","static","html","index.html"))
})

export function getPort():number{
    return PORT;
}

export function getApp():http.Server{
    return server;
}