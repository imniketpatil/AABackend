import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

//routes
import userRouter from "./routes/user.routes.js";
import testimonialRouter from "./routes/testimonial.routes.js";
import trekGuideRouter from "./routes/trekguide.routes.js";
import trekTypeRouter from "./routes/trektype.routes.js";
import trekRouter from "./routes/trek.routes.js";

//routes declearation
app.use("/api/v1/users", userRouter);

app.use("/api/v1/testimonial", testimonialRouter);

app.use("/api/v1/trekguide", trekGuideRouter);

app.use("/api/v1/trektype", trekTypeRouter);

app.use("/api/v1/trek", trekRouter);

export { app };
