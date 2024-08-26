import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

const allowedOrigins = ["https://alpha-adventures-admin.vercel.app", "https://alpha-adventures-client.vercel.app/"];

const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      // Allow requests with no origin (like mobile apps or curl requests)
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PATCH", "DELETE"], // Specify allowed methods
  credentials: true, // Allow cookies and other credentials to be sent
};

app.use(cors(corsOptions));

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

//routes
import userRouter from "./routes/user.routes.js";
import trekGuideRouter from "./routes/trekguide.routes.js";
import trekTypeRouter from "./routes/trektype.routes.js";
import trekRouter from "./routes/trek.routes.js";
import testimonialRouter from "./routes/testimonial.routes.js";

//routes declaration
app.use("/api/v1/users", userRouter);
app.use("/api/v1/trekguide", trekGuideRouter);
app.use("/api/v1/trektype", trekTypeRouter);
app.use("/api/v1/trek", trekRouter);
app.use("/api/v1/testimonial", testimonialRouter);

export { app };
