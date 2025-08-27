import cors, { CorsOptions } from 'cors';

export class CorsConfig{
    public static readonly allowedOrigins:string[]=["*"];
    public static readonly origin={origin:function(origin:string,callback:any){
            if(CorsConfig.allowedOrigins.indexOf(origin)!==1){
                callback(null,true);
            }else{
                callback(new Error("Not allowed by CORS"))
            }
        }}

    public static getCorsOptions():CorsOptions{
        return {
            origin:CorsConfig.allowedOrigins
        }
    }

    
}