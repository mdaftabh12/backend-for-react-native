import { Router } from "express";

import {
  createTodo,
  getAllTodo,
  getTodo,
  updateTodo,
  deleteTodo,
  filter,
  search,
} from "../controllers/todo.controller";

const router = Router();

router.post("/create-todo", createTodo);

router.get("/get-all-todos", getAllTodo);

router.get("/get-todo", getTodo);

router.get("/update-todo", updateTodo);

router.get("/delete-todo", deleteTodo);

router.get("/search-todos", search);

router.post("/filter-todos", filter);

export default router;
