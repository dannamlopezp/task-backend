
import jwt from "jsonwebtoken";
export function authMiddleware(req,res,next){
  const h=req.headers.authorization;
  if(!h) return res.status(401).json({message:"No token"});
  try{
    const token=h.split(" ")[1];
    req.user=jwt.verify(token, process.env.JWT_SECRET);
    next();
  }catch(e){return res.status(403).json({message:"Token inválido"})}
}
