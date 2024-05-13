import { Router } from "express";
import { authMiddleware } from "../middleware/auth-middleware.js";
import groupController from "../controller/group-controller.js";
import userController from "../controller/user-controller.js";
import messageController from "../controller/message-controller.js";

// Users need to be logged in to access these endpoints

export const userRouter = Router();

userRouter.use(authMiddleware); // check for authentication

// User API
userRouter.get("/api/users/:username", userController.get);
userRouter.delete("/api/users/logout", userController.logout);
userRouter.patch("/api/users/current", userController.update);

// Group API
userRouter.post("/api/groups", groupController.create);
userRouter.get("/api/groups/:groupId", groupController.get);
userRouter.get("/api/groups", groupController.list);
userRouter.put("/api/groups/:groupId", groupController.update);
userRouter.post("/api/groups/:groupId/members", groupController.addMember);
userRouter.delete(
    "/api/groups/:groupId/members/:memberUsername",
    groupController.removeMember
);

// Message API
userRouter.post("/api/groups/:groupId/messages", messageController.create);
userRouter.get("/api/groups/:groupId/messages", messageController.list);
userRouter.delete(
    "/api/groups/:groupId/messages/:messageId",
    messageController.remove
);
