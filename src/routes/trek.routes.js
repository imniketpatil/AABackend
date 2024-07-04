import { Router } from "express";
import { addTrek } from "../controllers/trek.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { aggregateTrekWithGuides } from "../controllers/trek.controller.js";
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

router.route("/treks-with-guides").get(aggregateTrekWithGuides);

export default router;
