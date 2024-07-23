import { Router } from "express";
import passport from "passport";
import recipeController from "../controllers/recipeController";
import upload from "../middlewares/multer";

const router = Router();

router.post("/",passport.authenticate('jwt',{session:false}),upload.single("image"),recipeController.addRecipe);
router.put("/:id",passport.authenticate('jwt',{session:false}),upload.single("image"),recipeController.updateRecipe);
router.get("/",recipeController.getAllRecipe);
router.get("/users",passport.authenticate('jwt', { session: false }),recipeController.getUsersAllRecipes);
router.get("/:id",recipeController.getRecipeById);
router.delete("/:id",passport.authenticate('jwt', { session: false }),recipeController.deleteRecipe);

export default router;
