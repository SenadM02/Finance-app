import bcrypt from "bcrypt";
import db from '../config/db.js';
import express from "express";

const router = express.Router();

router.post("/login", async (req, res) => {
    const {email, password} = req.body;

    db.query("SELECT * FROM users WHERE email = ?", [email], async (err, result) =>{
        if(err) return res.status(500).json({ message: err.message });
        if(result.length === 0){
            return res.status(404).json({ message: "Email not registered "});
        }

        const user = result[0];

        const isMatch = bcrypt.compare(password, user.password);

        if(isMatch){
            res.status(200).json({
                message: "success"
            });
        }else {
            res.status(401).json({ message: "wrong password" });
        }
    });
});

router.post("/register", async (req, res) => {
    const {email, password} = req.body;

    if(!email || !password){
        return res.status(400).json({message: "email and password are required"});
    }
    try {
        db.query("SELECT * from users WHERE email = ?", [email], async (err, result) =>{
            if(err) return res.status(500).json({ error: err.message });
            if(result.length > 0 ){
                return res.status(409).json({ message: "Email already in use"});
            }

            const hashedPw = await bcrypt.hash(password, 10);

            db.query("INSERT INTO users (email, password) VALUES(?, ?)", [email, hashedPw], (err, result) => {
                if(err) return res.status(500).json({message: err.message });
                res.status(201).json({ message: "Registered successfully" });
            });
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default router;