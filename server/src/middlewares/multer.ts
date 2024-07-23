import { Request } from "express";
import multer , {diskStorage} from "multer";
import path from "path";


type DestinationCallback = (error:Error | null , destination:string)=>void
type FilenameCallback = (error:Error|null , filename:string)=>void

const storage = diskStorage({
    destination:(req:Request,file:Express.Multer.File , cb:DestinationCallback):void=>{
        cb(null,'./images/');
    },
    filename:(req:Request , file:Express.Multer.File , cb:FilenameCallback):void=>{
        const cgname = Date.now()+path.extname(file.originalname)
        req.body.filename = cgname;
        console.log(cgname);
        cb(null,cgname);
    }
})

const upload = multer({storage:storage});

export default upload;