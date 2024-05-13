import { Router } from "express";
import userController from "../controller/user-controller.js";

export const publicRouter = Router();

// Users doesn't need to be logged in to access these endpoints

publicRouter.post("/api/users", userController.register);
publicRouter.post("/api/users/login", userController.login);

publicRouter.get("/api/ping", (req, res) => {
    res.json({ data: "pong!!" });
});
