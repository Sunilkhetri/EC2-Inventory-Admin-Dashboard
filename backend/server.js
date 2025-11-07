// server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import instanceRoutes from "./routes/instanceRoutes.js";
import db from "./config/db.js"
dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// quick test DB connection at startup
(async () => {
  try {
    const conn = await db.getConnection();
    await conn.ping();
    conn.release();
    console.log("✅ MySQL connected.");
  } catch (err) {
    console.error("MySQL connection failed:", err);
  }
})();

app.use("/api", instanceRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
