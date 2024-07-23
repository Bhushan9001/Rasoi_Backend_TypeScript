import { NextFunction, Request, Response } from "express";
import prisma from "../prisma";


const likeDislike = async(req:Request,res:Response,next:NextFunction)=>{

         const {commentId} = req.params;
         const userId = req.user.id;

         try {
            const like = await prisma.like.findUnique({
                where:{
                    userId_commentId : {userId:userId,commentId:Number(commentId)}
                }
            })

            if(like){
                await prisma.like.delete({
                    where:{
                        userId_commentId : {userId:userId,commentId:Number(commentId)}
                    }
                })
                next()
               
            }
            else{
                 await prisma.like.create({
                    data:{
                        userId:userId,
                        comment:{
                            connect:{
                                id:Number(commentId)
                            }
                        }
                    }
                })
                next()
            }
           
         } catch (error) {
            console.log(error);
            res.status(501).json({ "Message": "Internal Server Error", error })
         }

}

export default likeDislike;