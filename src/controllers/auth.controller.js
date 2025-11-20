
import {pool} from "../config/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function register(req,res){
  try{
    const {name,email,password}=req.body;
    const [u]=await pool.query("SELECT id FROM users WHERE email=?", [email]);
    if(u.length) return res.status(400).json({message:"Email ya existe"});
    const hash=await bcrypt.hash(password,10);
    await pool.query("INSERT INTO users(name,email,password) VALUES(?,?,?)",[name,email,hash]);
    res.json({message:"Usuario registrado"});
  }catch(e){res.status(500).json({error:e.message})}
}

export async function login(req,res){
  try{
    const {email,password}=req.body;
    const [u]=await pool.query("SELECT * FROM users WHERE email=?",[email]);
    if(!u.length) return res.status(400).json({message:"Credenciales inválidas"});
    const ok=await bcrypt.compare(password,u[0].password);
    if(!ok) return res.status(400).json({message:"Credenciales inválidas"});
    const token=jwt.sign({id:u[0].id,email},process.env.JWT_SECRET,{expiresIn:"1d"});
    res.json({token});
  }catch(e){res.status(500).json({error:e.message})}
}
