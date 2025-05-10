import express from "express";
import cors from "cors";
import "dotenv/config";
import { createServer } from "http";

import connectDB from "./config/mongodb.js";
import userRouter from "./routes/userRoutes.js";
import imageRouter from "./routes/imageRoutes.js";
import verifyPaystack from "./routes/verifyPaystack.js";

const PORT = process.env.PORT || 4000;
const app = express();

app.use(cors());
app.use(express.json());

await connectDB();

app.use("/api/user", userRouter);
app.use("/api/image", imageRouter);
app.use("/api/user/verify", verifyPaystack);

app.get("/", (req, res) => res.send("API Working"));

// ✅ Local development
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log("Server running locally on port " + PORT);
  });
}

// ✅ Vercel serverless support
const server = createServer(app);

export default function handler(req, res) {
  server.emit("request", req, res);
}
