import express from "express";
import { checkUser, generateToken, getAllUsers, onBoardUser } from "../controllers/AuthController.js";

const router = express.Router()

router.route("/check-user").post(checkUser);
router.route("/onboard-user").post(onBoardUser);
router.route("/getUsers").get(getAllUsers);
router.route("/generate-token/:userId").get(generateToken);

export default router;
