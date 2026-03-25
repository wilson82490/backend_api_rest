import {Router} from 'express';

const router = Router();

import {login, register, profile} from "../controllers/auth.controller.js";
import { authMiddleware } from '../middlewares/auth.middleware.js';


router.post("/login", login);
router.post('/register', register);

router.get("/profile", authMiddleware, profile);

export default router;

