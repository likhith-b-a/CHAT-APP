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

router.route("/add-image-message").post(
  upload.single("image"),
  addImageMessage
);

// router.route("/add-audio-message").post(
//   upload.fields([
//     {
//       name: "audio",
//       maxCount: 1,
//     },
//   ]),
//   addAudioMessage
// );
router.route("/add-audio-message").post(
  upload.single("audio"),
  addAudioMessage
);


router
  .route("/get-initial-contacts/:from")
  .get(getInitaialContactsWithMessages);

export default router;
