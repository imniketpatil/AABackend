import express from "express";
import path from "path";
import cors from "cors";
import cookieParser from "cookie-parser";

// Create express app
const app = express();

// Define the path to the 'public' directory directly
const publicPath = path.resolve("public");

// CORS configuration
const allowedOrigins = ["https://alpha-adventures.onrender.com", "https://alpha-adventures-client.onrender.com"];
const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));

// Middleware
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static(publicPath));
app.use(cookieParser());

// Routes
import userRouter from "./routes/user.routes.js";
import trekGuideRouter from "./routes/trekguide.routes.js";
import trekTypeRouter from "./routes/trektype.routes.js";
import trekRouter from "./routes/trek.routes.js";
import testimonialRouter from "./routes/testimonial.routes.js";

app.use("/api/v1/users", userRouter);
app.use("/api/v1/trekguide", trekGuideRouter);
app.use("/api/v1/trektype", trekTypeRouter);
app.use("/api/v1/trek", trekRouter);
app.use("/api/v1/testimonial", testimonialRouter);

export { app };
