// db.js - MySQL pool using mysql2/promise
import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASS || "",
  database: process.env.DB_NAME || "ec2_dashboard",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export default pool;
