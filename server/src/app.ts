import express from "express";
import cors from "cors";
import helmet from "helmet";
import prisma from "./lib/prisma";
import authRoutes from "./routes/auth.routes";

const app = express();

app.use(helmet());

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));

app.use(express.json());

app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
    res.send("Authentication API Running 🚀");
});

app.get("/users", async (req, res) => {
    const users = await prisma.user.findMany();

    res.json(users);
});


export default app;