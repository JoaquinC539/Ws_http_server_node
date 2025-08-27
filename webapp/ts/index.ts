import { Server } from "http";
import { getApp, getPort } from "./App";
const Port=getPort()
const app:Server=getApp()
app.listen(Port,()=>{
    console.log("Server running of http://localhost:"+Port)
})