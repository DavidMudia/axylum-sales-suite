import express from "express";
import cors from "cors";
import helmet from "helmet";
import authRoutes from "./modules/auth/auth.routes";
import dashboardRoutes from "./modules/dashboard/dashboard.routes";
const app = express();

console.log("1");

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

console.log("2");

app.use(helmet());

console.log("3");

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

console.log("4");

app.use(express.json());

console.log("5");

app.use("/api/auth", authRoutes);

console.log("6");

app.get("/", (req, res) => {
  console.log("Root route hit");
  res.send("Authentication API Running 🚀");
});

console.log("7");

app.use(
  "/api/dashboard",
  dashboardRoutes
);
export default app;