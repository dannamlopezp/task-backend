
import {pool} from "../config/db.js";

export async function createTask(req,res){
  const {title,description,dueDate,priority,status}=req.body;
  await pool.query(
    "INSERT INTO tasks(title,description,dueDate,priority,status,userId) VALUES(?,?,?,?,?,?)",
    [title,description,dueDate,priority,status,req.user.id]
  );
  res.json({message:"Tarea creada"});
}

export async function getTasks(req,res){
  const {status,priority,search}=req.query;
  let q="SELECT * FROM tasks WHERE userId=?";
  let params=[req.user.id];
  if(status){q+=" AND status=?"; params.push(status);}
  if(priority){q+=" AND priority=?"; params.push(priority);}
  if(search){q+=" AND (title LIKE ? OR description LIKE ?)"; params.push(`%${search}%`,`%${search}%`);}
  const [rows]=await pool.query(q, params);
  res.json(rows);
}

export async function getTask(req,res){
  const [rows]=await pool.query("SELECT * FROM tasks WHERE id=? AND userId=?",[req.params.id,req.user.id]);
  if(!rows.length) return res.status(404).json({message:"No encontrada"});
  res.json(rows[0]);
}

export async function updateTask(req,res){
  const {title,description,dueDate,priority,status}=req.body;
  await pool.query("UPDATE tasks SET title=?,description=?,dueDate=?,priority=?,status=? WHERE id=? AND userId=?",
  [title,description,dueDate,priority,status,req.params.id,req.user.id]);
  res.json({message:"Actualizada"});
}

export async function deleteTask(req,res){
  await pool.query("DELETE FROM tasks WHERE id=? AND userId=?",[req.params.id,req.user.id]);
  res.json({message:"Eliminada"});
}

export async function completeTask(req,res){
  await pool.query("UPDATE tasks SET status='completada' WHERE id=? AND userId=?",[req.params.id,req.user.id]);
  res.json({message:"Completada"});
}
