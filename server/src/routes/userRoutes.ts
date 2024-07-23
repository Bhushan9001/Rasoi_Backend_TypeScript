import authController from "../controllers/userControllers";
import { Router } from "express";

const router = Router();

router.post("/signup",authController.signup);
router.post("/signin",authController.signin);

export default router;