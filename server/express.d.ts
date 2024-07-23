import * as express from 'express';
import { File } from 'multer';


interface User{
    id:number,
    email:string,
    name:string,
    password:string
}
declare module 'express-serve-static-core' {
    interface Request {
      user:User,
      file:File|null
    }
  }
