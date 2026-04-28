import bcrypt from "bcrypt";
import db from '../config/db.js';
import express from "express";
import jwt from 'jsonwebtoken';
import { verifyToken } from "../middleware.js";

const router = express.Router();

router.post("/login", async (req, res) => {
    const {email, password} = req.body;

    db.query("SELECT * FROM users WHERE email = ?", [email], async (err, result) =>{
        if(err) return res.status(500).json({ message: err.message });
        if(result.length === 0){
            return res.status(404).json({ message: "Email not registered "});
        }

        const user = result[0];

        const isMatch = await bcrypt.compare(password, user.password);

        if(isMatch){
            const token = jwt.sign(
                { id: user.id, email: user.email }, 
                process.env.JWT_SECRET, 
                { expiresIn: "96h" }
            );
            res.cookie("authToken", token, {
                httpOnly: true,
                secure: true,
                sameSite: "strict",
                maxAge: 96 * 60 * 60 * 1000
            });
            res.status(200).json({ message: "success", email: user.email });
        }else {
            res.status(401).json({ message: "wrong password" });
        }
    });
});

router.post("/logout", (req, res) => {
    res.clearCookie("authToken");
    res.json({ message: "Logged out" });
});

router.post("/register", async (req, res) => {
    const {name, email, password} = req.body;

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

            db.query("INSERT INTO users (name, email, password) VALUES(?, ?, ?)", [name, email, hashedPw], (err, result) => {
                if(err) return res.status(500).json({message: err.message });
                res.status(201).json({ message: "Registered successfully" });
            });
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post("/transactions", verifyToken, async (req, res) => {
    const {amount, type, description} = req.body;
    const email = req.user.email;
    try{
        db.query("SELECT id FROM users WHERE email = ?", [email], (err, result) => {
            if(err) return res.status(404).json({ message: err.message });
            
            const user_id = result[0].id;

            db.query("INSERT INTO transactions (user_id, amount, type, description) VALUES(?, ?, ?, ?)", [user_id, amount, type, description], (err, result) => {
                if(err) return res.status(500).json({ message: err.message });
                res.status(201).json({ message: "Transaction added" });
            });
        })
    }catch(err){
        res.status(500).json({ message: err.message });
    }
})

router.get("/transactions", verifyToken, (req, res) => {
    const userEmail = req.user.email;

    db.query("SELECT transactions.* from transactions JOIN users on transactions.user_id=users.id WHERE users.email = ? ORDER BY transactions.id desc", [userEmail], (err, result) => {
        if(err) res.status(500).json({ message: err.message });
        res.json(result);
    })
})

router.get("/user", verifyToken, (req, res) => {
    const email = req.user.email;

    db.query("SELECT users.name FROM users where email=?", [email], (err, result) => {
        if(err) return res.status(500).json({ message: err.message });
        if(result.length > 0){
            res.json(result[0]);
        }else{
            res.status(404).json({ message: "not founde" });
        }
    })
})

router.get("/transactions/:type", verifyToken, (req, res) => {
    const email = req.user.email;
    const type = req.params.type;

    db.query("SELECT SUM(t.amount) as sum from transactions t join users on t.user_id=users.id where email=? and type=?", [email, type], (err, result) =>{
        if(err) return res.status(500).json({ message: err.message });

        if(result.length > 0){
            res.json(result[0]);
        }else res.status(404).json({ message: err.message });
    })
})

router.delete("/clear", verifyToken, (req, res) => {
    const email = req.user.email;

    db.query("DELETE t FROM transactions t JOIN users ON t.user_id=users.id WHERE email=?", [email], (err, result) => {
        if(err) res.status(500).json({ message: err.message });
        res.json({ message: "Table cleared"});
    })
})

router.delete("/row/delete/:id", (req, res) => {
    const id = req.params.id;

    db.query("Delete t FROM transactions t WHERE t.id=?", [id], (err, result) =>{
        if(err) res.status(500).json({ message: err.message });
    })
})

export default router;