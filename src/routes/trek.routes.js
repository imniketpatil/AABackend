import { Router } from "express";
import { addTrek } from "../controllers/trek.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.route("/create-trek").post(
  upload.fields([
    {
      name: "trekImage",
      maxCount: 6,
    },
  ]),
  addTrek
);

export default router;
