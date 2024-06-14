import { Router } from "express";
import { createTestimonial } from "../controllers/testimonial.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.route("/create-testimonial").post(
  upload.fields([
    {
      name: "testimonialAvatar",
      maxCount: 1,
    },
  ]),
  createTestimonial
);
