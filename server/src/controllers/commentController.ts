import { Request, Response } from "express";
import prisma from "../prisma";


const commentController = {
    addComment: async (req: Request, res: Response) => {
        try {
            const { text } = req.body;
            const { recipeId } = req.params;
            const authorId = req.user.id;
            const comment = await prisma.comment.create({
                data: {
                    text: text,
                    recipe: {
                        connect: {
                            id: Number(recipeId)
                        }
                    },
                    author: {
                        connect: {
                            id: authorId
                        }
                    }

                }
            })
            if (!comment) return res.status(501).json({ "message": "Unabel to add comment" });
            res.status(201).json({ comment });
        } catch (error) {
            console.log(error);
            res.status(501).json({ "Message": "Internal Server Error", error })
        }

    },
    deleteComment: async (req: Request, res: Response) => {
        const { id } = req.params;
        try {
            await prisma.comment.delete({
                where: { id: Number(id) }
            }).then(() => { res.status(201).json({ "message": "Comment deleted Successfully!!" }) })
        } catch (error) {
            console.log(error);
            res.status(501).json({ "Message": "Internal Server Error", error })
        }
    },
    getCommentsByRecipe: async (req: Request, res: Response) => {
        const { recipeId } = req.params;
        try {

            const comments = await prisma.comment.findMany({
                where: {
                    reicpeId: Number(recipeId)
                },
                include: {
                    replies:true
                }
            })
            if (comments.length == 0) res.status(401).json({ "message": "No comments on this Recipe" });

            res.status(201).json({ comments });

        } catch (error) {
            console.log(error);
            res.status(501).json({ "Message": "Internal Server Error", error })
        }
    },

    addReply: async (req: Request, res: Response) => {
        const { commentId } = req.params;
        const userId = req.user.id;
        const { text } = req.body;
        try {
             const reply = await prisma.comment.create({
                data:{
                    text:text,
                    author:{
                        connect:{
                            id:userId
                        }
                    },
                    parentComment:{
                        connect:{
                            id:Number(commentId)
                        }
                    }

                }
             })
             
             res.status(201).json({reply})
        } catch (error) {
            console.log(error);
            res.status(501).json({ "Message": "Internal Server Error", error })
        }
    },
    commentLikes: async (req: Request, res: Response) => {
         
        const {commentId} = req.params;
        
        try {
            const like_count = await prisma.comment.findUnique({
                where:{
                    id:Number(commentId)
                },
                include:{
                    _count:{
                        select:{
                            likes:true
                        }
                    }
                }
            })
            res.send(like_count);
        } catch (error) {
            console.log(error);
            res.status(501).json({ "Message": "Internal Server Error", error })
        }
    }


}

export default commentController;