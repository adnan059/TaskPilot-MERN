import dotenv from "dotenv";
import cors from "cors";
import express from "express";
import { connectDB } from "./config/db.js";
import routes from "./routes/index.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.get("/", (req, res) => {
  return res.send("Working Ok");
});

app.use("/api-v1", routes);

// 👉 404 handler — placed AFTER routes, BEFORE error middleware
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  const status = err?.status || 500;
  const message = err?.message || "Something Went Wrong";
  return res.status(status).json({
    status,
    message,
    stack: err?.stack,
    success: false,
  });
});

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => console.log(`Server Listening on Port ${PORT}`));
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

startServer();
