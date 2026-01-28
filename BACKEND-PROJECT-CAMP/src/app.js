import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";


import authRouter from "./routes/auth.routes.js";
import projectRouter from "./routes/project.routes.js";
import taskRouter from "./routes/task.routes.js";
import heathChekRouter from "./routes/healthcheck.routes.js";

const app = express();

//basic configuration
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

//cors configuration
app.use(
  cors({
    origin: process.env.CORS_ORIGIN?.split(",") || "http://localhost:5173",
    credentials: false,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Authorization", "Content-Type"],
  }),
);

//import the route
// import heathChekRouter from "./routes/healthcheck.routes.js";

// import authRouter from "./routes/auth.routes.js";

app.use("/api/v1/healthcheck", heathChekRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", authRouter);
app.use("/api/v1/projects", projectRouter);
app.use("/api/v1/tasks", taskRouter);

app.get("/", (req, res) => {
  res.send("welcome to base");
});

export default app;
