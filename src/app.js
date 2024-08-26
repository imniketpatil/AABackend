import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

// Define the allowed origins
const allowedOrigins =[
  "https://alpha-adventures-admin-o0pk5tvip-niket-patils-projects.vercel.app", 
  "https://alpha-adventures-client-1re7g09zx-niket-patils-projects.vercel.app"
];

// CORS configuration options
const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true); // Allow the request if the origin is in the allowedOrigins list or if there's no origin (e.g., for mobile apps or curl)
    } else {
      callback(new Error("Not allowed by CORS")); // Reject the request if the origin is not allowed
    }
  },
  methods: ["GET", "POST", "PATCH", "DELETE"], // Specify allowed HTTP methods
  credentials: true, // Allow cookies and other credentials to be sent
  allowedHeaders: ["Content-Type", "Authorization"], // Specify allowed headers
};

// Use CORS middleware with the options
app.use(cors(corsOptions));

// Other middlewares
app.use(express.json({ limit: "16kb" })); // Parse JSON with a size limit of 16kb
app.use(express.urlencoded({ extended: true, limit: "16kb" })); // Parse URL-encoded data with a size limit of 16kb
app.use(express.static("public")); // Serve static files from the 'public' directory
app.use(cookieParser()); // Parse cookies

// Import your route handlers
import userRouter from "./routes/user.routes.js";
import trekGuideRouter from "./routes/trekguide.routes.js";
import trekTypeRouter from "./routes/trektype.routes.js";
import trekRouter from "./routes/trek.routes.js";
import testimonialRouter from "./routes/testimonial.routes.js";

// Declare routes
app.use("/api/v1/users", userRouter);
app.use("/api/v1/trekguide", trekGuideRouter);
app.use("/api/v1/trektype", trekTypeRouter);
app.use("/api/v1/trek", trekRouter);
app.use("/api/v1/testimonial", testimonialRouter);

// Export the app
export { app };
