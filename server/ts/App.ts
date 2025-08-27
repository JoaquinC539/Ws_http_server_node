import express, { Express } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import Websocket from 'ws';
import http from 'http';
import { Routes } from './Routes';
import { WssActions } from './WssActions';
const PORT=4682;
const app: Express = express();

const server:http.Server= http.createServer(app);

const wss= new Websocket.Server({server});

const wsa=new WssActions(wss);

wsa.setWssEvents();


app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const routes = new Routes();
app.use("/api",routes.getRoutes())




// app.listen(PORT,()=>{
//     console.log(`Listening on port ${PORT}`);
// });

export function getPort():number{
    return PORT;
}

export function getApp():http.Server{
    return server;
}