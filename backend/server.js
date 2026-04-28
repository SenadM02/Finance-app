import express from "express";
import cors from "cors";
import authRoutes from './routes/auth.js';
import cookieParser from "cookie-parser";

const app = express();

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log("server running");
})

