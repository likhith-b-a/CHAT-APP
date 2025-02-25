import { Router } from "express";
import {
  addAudioMessage,
  addImageMessage,
  addMesssage,
  getInitaialContactsWithMessages,
  getMessages,
} from "../controllers/MessageController.js";
import { upload } from "../middlewares/upload.js";

const router = Router();

router.route("/addMessage").post(addMesssage);
router.route("/getMessages/:from/:to").get(getMessages);
// router.route("/add-image-message/:from/:to").post(getMessages);

router.route("/add-image-message").post(
  upload.fields([
    {
      name: "image",
      maxCount: 1,
    },
  ]),
  addImageMessage
);

router.route("/add-audio-message").post(
  upload.fields([
    {
      name: "audio",
      maxCount: 1,
    },
  ]),
  addAudioMessage
);

router
  .route("/get-initial-contacts/:from")
  .get(getInitaialContactsWithMessages);

export default router;
