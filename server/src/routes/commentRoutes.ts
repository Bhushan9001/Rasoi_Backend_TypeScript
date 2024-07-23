import { Router } from "express";
import passport from "passport";
import commentController from "../controllers/commentController";
import likeDislike from "../middlewares/likeDislike";

const router = Router();

router.get("/:recipeId/comments", commentController.getCommentsByRecipe)
router.post("/:recipeId/comments", passport.authenticate('jwt', { session: false }), commentController.addComment);
router.delete("/comments/:id", passport.authenticate('jwt', { session: false }), commentController.deleteComment);
router.post("/comments/:commentId/replies", passport.authenticate('jwt', { session: false }), commentController.addReply);
router.post("/comments/:commentId/like",passport.authenticate('jwt', { session: false }),likeDislike,commentController.commentLikes);

export default router;