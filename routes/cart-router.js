import {Router} from "express";
const router = Router();

import { addToCart, deleteCart, getCart, removeFromCart } from "../controllers/cart-controller.js";
import { authMiddleware,  } from "../middlewares/auth.middleware.js";



router.post("/", authMiddleware, addToCart);
router.get("/", authMiddleware, getCart );
router.delete("/", authMiddleware, deleteCart);
router.delete("/:productId", authMiddleware, removeFromCart);


export default router;
