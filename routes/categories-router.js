

import {Router} from "express"
import { 
  createCategory, 
  getCategories, 
  getCategoryById,
  updateCategory,
  deleteCategory,
  searchCategories
} from "../controllers/categories-controllers.js";
//import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();





//=======CATEGORIES========//
router.get("/search",searchCategories);
//router.get("/",authMiddleware,getCategories);
router.get("/",getCategories);
router.get("/:id", getCategoryById);
router.post("/",createCategory);
router.put("/:id", updateCategory);
router.delete("/:id", deleteCategory);

 export default router;

