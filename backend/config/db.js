import dotenv from "dotenv";
import mysql from "mysql2";

dotenv.config();

const db = mysql.createConnection({
   host: process.env.DB_HOST,
   user: process.env.DB_USER,
   password: process.env.DB_PASSWORD,
   database: process.env.DB_NAME, 
});

db.connect((err) => {
    if(err){
        console.log("connection failed");
        return;
    }
    console.log("connected successfullay");
})

export default db;