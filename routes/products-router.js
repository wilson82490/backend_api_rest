

import {Router} from "express"

const router = Router();

import { 
    createProduct, 
    getProductById, 
    getProducts, 
    updateProduct,
    deleteProduct,
    searchProducts,
    getProductsByCategoryID,
    getProductsByOwner
                 } from "../controllers/products-controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";



//======PRODUCTS========//
router.get("/my-products", authMiddleware, getProductsByOwner);
router.get("/search",searchProducts);
router.get("/", getProducts);
router.get("/:id", getProductById );
//router.post("/",authMiddleware, createProduct);
router.post("/",authMiddleware, createProduct);
router.put("/:id",authMiddleware, updateProduct);
router.delete("/:id",authMiddleware, deleteProduct);

router.get("/category/:categoryId", getProductsByCategoryID);





export default router;