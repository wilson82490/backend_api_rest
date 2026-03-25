import {Router} from "express"

const router = Router();

router.post("/cart", (req, res)=>{
    res.send({message: "productos en el carrito"});
});


export default router;