
import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
   try {
    // console.log(req.headers);


   const authHeader = req.headers.authorization;

    if(!authHeader){
     return res.status(401).json({message: "Authorization header is missing"});
    };

    if(!authHeader.startsWith("Bearer ")){
        return res.status(401).json({message: "Invalid authorization header format"});
    }

    //console.log(authHeader);
    //console.log(authHeader.split(" ")[1]);

    //const array = authHeader.split(" "); 

   /*  const [bearer, token] = array;
    console.log(token); */
const [, token] = authHeader.split(" ");

console.log(token);

const decoded = jwt.verify(token, process.env.JWT_SECRET);

//console.log(decoded);

req.user = decoded;
next();

   } catch (error) {
    res.status(401).json({message: "Invalid token"});
    
   }
};