
import {Router} from "express";
import {authMiddleware} from "../middlewares/authMiddleware.js";
import {createTask,getTasks,getTask,updateTask,deleteTask,completeTask} from "../controllers/task.controller.js";

const r=Router();
r.use(authMiddleware);
r.post("/", createTask);
r.get("/", getTasks);
r.get("/:id", getTask);
r.put("/:id", updateTask);
r.delete("/:id", deleteTask);
r.patch("/:id/complete", completeTask);

export default r;
