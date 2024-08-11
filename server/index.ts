import http from 'http';
import express,{Express,Request,Response} from 'express';
import passport from 'passport';
import "./src/passport";
import path from 'path';


import userRoutes from './src/routes/userRoutes';
import recipeRoutes from './src/routes/recipeRoutes';
import commentRoutes from './src/routes/commentRoutes';



const app:Express = express();

app.use(express.json());
app.use(passport.initialize());
app.use("/images",express.static(path.join(__dirname,"../images")));

// const PORT:number = Number(process.env.PORT);

const server = http.createServer(app);

//testing route
app.get("/",(req:Request,res:Response)=>{
    res.send("<h1>I am inevitable!!</h1>");
})

//Server Routes
app.use("/users",userRoutes);
app.use("/recipes",recipeRoutes);
app.use("/recipes",commentRoutes);




server.listen(8080,()=>{
    console.log("[server]:- http://localhost:8080");
})


