import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import {
  addTrekType,
  deleteTrekType,
  editTrekType,
} from "../controllers/trektype.controller.js";

const router = Router();

router.route("/add-trek-type").post(
  upload.fields([
    {
      name: "trekTypeImage",
      maxCount: 6,
    },
  ]),
  addTrekType
);

router.route("/edit-trektype/:id").patch(
  upload.fields([
    {
      name: "trekTypeImage",
      maxCount: 1,
    },
  ]),
  editTrekType
);

router.route("/remove-trektype/:id").delete(deleteTrekType);

export default router;
