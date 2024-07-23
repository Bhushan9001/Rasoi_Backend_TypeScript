import { Request, Response } from "express";
import prisma from "../prisma";


const recipeController = {
    addRecipe: async (req: Request, res: Response) => {
        try {
            const { title, description, type, cuisine, instructions, ingredients } = req.body;
            const imageurl = req.file ? `/images/${req.body.filename}` : " ";
            console.log(imageurl);
            const recipe = await prisma.recipe.create({
                data: {
                    title: title,
                    description: description,
                    type: type,
                    cuisine: cuisine,
                    instructions: instructions,
                    ingredients: {
                        create: ingredients
                    },
                    imageurl: imageurl,
                    authorName: req.user.name,
                    author: {
                        connect: {
                            id: req.user.id
                        }
                    }
                }, include: {
                    ingredients: true
                }
            })
            if (!recipe) return res.status(401).json({ "message": "Error while adding recipe!!" });

            res.status(201).json({ "message": "Recipe added Successfully!!", recipe });


        } catch (error) {
            console.log(error);
            res.status(501).json({ "Message": "Internal Server Error", error })
        }
    },
    updateRecipe:async(req:Request,res:Response)=>{
        const { title, description, type, cuisine, instructions, ingredients } = req.body;
        const imageurl = req.file ? `/images/${req.body.filename}` : " ";
        const authorName = req.user.name;
        const authorId =  req.user.id;
        const {id} = req.params;

        try {
            const recipe = await prisma.recipe.update({
                where:{
                    id:Number(id)
                },
                data: {
                    title: title,
                    description: description,
                    type: type,
                    cuisine: cuisine,
                    instructions: instructions,
                    ingredients: {
                        create: ingredients
                    },
                    imageurl: imageurl,
                    authorName: req.user.name,
                    author: {
                        connect: {
                            id: req.user.id
                        }
                    }
                }
            })

            res.status(201).json({recipe});
               
        } catch (error) {
            console.log(error);
            res.status(501).json({ "Message": "Internal Server Error", error })
        }
    },
    deleteRecipe: async(req:Request , res:Response) =>{
            const {id} = req.params;
            try {

                await prisma.ingredient.deleteMany({
                    where:{recipeId:Number(id)}
                })
                await prisma.comment.deleteMany({
                    where:{reicpeId:Number(id)},
                })
                await prisma.recipe.delete({
                    where:{id:Number(id)}
                }).then(()=>{
                    res.status(201).json({"message":"Deleted Successfully!!"})
                })
                
            } catch (error) {
                console.log(error);
            res.status(501).json({ "Message": "Internal Server Error", error })
            }
    },
    getAllRecipe: async (req: Request, res: Response) => {
        try {
            const recipes = await prisma.recipe.findMany({
                include: {
                    ingredients: true
                }
            });
            if (recipes.length == 0 || !recipes) return res.status(401).json({ "Message": "Error while fetching recipes" })
            res.status(201).json({ recipes });

        } catch (error) {
            console.log(error);
            res.status(501).json({ "Message": "Internal Server Error", error })
        }

    },
    getRecipeById: async (req: Request, res: Response) => {
        try {
            const { id } = req.params;

            const recipe = await prisma.recipe.findUnique({
                where: {
                    id: Number(id)
                },
                select: {
                    ingredients: true,
                    comments: {
                        select: {
                            replies: true,
                            author: {
                                select: {
                                    id: true,
                                    name: true
                                }
                            }
                        }
                    }
                },

            })
            if (!recipe) return res.status(401).json({ "Message": "No Recipe Found!!" });
            res.status(201).json({ recipe });
        } catch (error) {
            console.log(error);
            res.status(501).json({ "Message": "Internal Server Error", error })
        }
    },
    getUsersAllRecipes: async (req: Request, res: Response) => {
        try {
            const id = req.user.id;
            // console.log(id)
            if (!id) res.status(403).json({ "Message": "You are not logged in" });
            const recipes = await prisma.recipe.findMany({
                where: { authorId: id },
                include: {
                    ingredients: true
                }
            })
            if (recipes.length == 0 || !recipes) return res.status(401).json({ "Message": "Error while fetching recipes" })
            res.status(200).json({ recipes })
        } catch (error) {
            console.log(error);
            res.status(501).json({ "Message": "Internal Server Error", error })
        }
    }
}

export default recipeController;