import "./Homepage.css"
import "../App.css"
import balance from '../../public/balance.png'
import income from '../../public/income.png'
import expense from '../../public/expense.png'
import acc from '../../public/acc.jpg'
import edit from '../../public/edit.jpg'
import del from '../../public/delete.jpg'
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../routes.jsx"
import { useForm } from "react-hook-form";

function Homepage() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const navigate = useNavigate();
    const logOut = () => {
        localStorage.removeItem("authToken");
        localStorage.removeItem("userEmail")
        navigate(ROUTES.LOGIN);
    }

    const [transactions, setTransactions] = useState([]);
    const [userName, setUserName] = useState("...");
    const [Income, setIncome] = useState(0);
    const [Expense, setExpense] = useState(0);
    const userEmail = localStorage.getItem('userEmail');

    const Balance = (Number(Income) - Number(Expense)).toFixed(2);

    useEffect( () => {
        const fetchUserName = async () => {
            try {
                const response = await fetch("http://localhost:3001/api/auth/user/" + userEmail);
                const data = await response.json();

                if(data.name){
                    setUserName(data.name);
                } 
            }catch(err){
                console.error("error:", err);
                setUserName("User");
            }
        };
        if(userEmail) fetchUserName();
    }, [userEmail]);

    useEffect( () => {
        const fetchIncome = async () => {
            try{
                const response = await fetch("http://localhost:3001/api/auth/transactions/Income/" + userEmail)
                const data = await response.json();

                if(data.sum){
                    setIncome(data.sum);
                }
            }catch(err){
                console.error("error: ", err);
                setIncome(0);
            }
        }
        if(userEmail) fetchIncome();
    }, [userEmail]);

    useEffect( () => {
        const fetchExpense = async () => {
            try{
                const response = await fetch("http://localhost:3001/api/auth/transactions/Expense/" + userEmail)
                const data = await response.json();

                if(data.sum){
                    setExpense(data.sum);
                }
            }catch(err){
                console.error("error: ", err);
                setExpense(0);
            }
        }
        if(userEmail) fetchExpense();
    }, [userEmail]);

    useEffect( () => {
        const fetchTrans = async () => {
            try{
                const response = await fetch ("http://localhost:3001/api/auth/transactions/" + userEmail);
                const data = await response.json();
                if(Array.isArray(data)){
                    setTransactions(data);
                } else {
                    console.error("Server returned an error object:", data);
                    setTransactions([]);
                }
            } catch(err) {
                console.error("error: ", err);
            }
        };
        if(userEmail) fetchTrans();
    }, [userEmail]);

    const onSubmit = async (data) => {
        const newEntry = {
            amount: Number(data.amount),
            type: data.type,
            description: data.description,
            date: new Date().toISOString()
        }

        try{
            const response = await fetch("http://localhost:3001/api/auth/transactions", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: localStorage.getItem('userEmail'),
                    ...newEntry
                })
            });

            if(response.ok){
                setTransactions((prev) => [newEntry, ...prev]);

                if(newEntry.type === "Income"){
                    setIncome((prev) => (Number(prev) + newEntry.amount)).toFixed(2);
                }else if (newEntry.type === "Expense"){
                    setExpense((prev) => (Number(prev) + newEntry.amount)).toFixed(2);
                }

                reset(); 
            }

        }catch(err){
            console.error("Connection problem");
        }
    };

    const onDelete = async () => {
        const confirm = window.confirm("Are you sure?");

        if(confirm){
            try{
                const response = await fetch("http://localhost:3001/api/auth/row/delete/", {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'applications/json'
                    }
                });
                
            } catch(err){
                console.error("Error:", err);
            }
        }
    }

    const clearTrans = async () => {
        const confirm = window.confirm("This cant be undone");

        if(confirm){
            try{
                const response = await fetch("http://localhost:3001/api/auth/clear/" + userEmail, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                if(response.ok){
                    setTransactions([]);
                    setIncome(0);
                    setExpense(0);
                }
            }catch(err){
                console.error("error: ", err);
            }
        }
    };

    return (
        <>
        <div className="homepage">
                <nav className="navbar">
                    <h2>Expense Tracker</h2>
                </nav>
            
            <div className="body">
                <div className="profile">
                    <div className="buttons">
                        <img src={acc} />
                        <p>{userName}</p>
                        <button className="settings">Settings</button>
                        <button className="trans">Transactions</button>
                        <button className="setup">Setup</button>
                        <button className="clear" onClick={clearTrans}>Clear transactions</button>
                    </div>
                    
                    <button className="logout" onClick={logOut}>Log out</button>
                </div>

                <div className="content">
                    <div className="saldos">
                        <div className="balanceBox">
                            <img src={balance}/>
                            <div className="text" style={{ color: Balance >= 0 ? 'green' : 'red'}}>
                                <p>Current Balance</p>
                                <h2>${Balance}</h2>
                            </div>
                        </div>
                        <div className="balanceBox">
                            <img src={income}/>
                            <div className="text" style={{ color: 'green' }}>
                                <p>Total income</p>
                                <h2>${Number(Income).toFixed(2)}</h2>
                            </div>
                        </div>
                        <div className="balanceBox" style={{ color: 'red' }}>
                            <img src={expense}/>
                            <div className="text">
                                <p>Expenses</p>
                                <h2>${Number(Expense).toFixed(2)}</h2>
                            </div>
                        </div>
                    </div>

                    <div className="formAndTable">
                        <div className="tableTrans">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Description</th>
                                        <th>Amount</th>
                                        <th>Type</th>
                                        <th>Date</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {transactions.map((trans, index) => (
                                        <tr key={index}>
                                            <td>
                                                <div className="cell-content">
                                                    {trans.description}
                                                </div>
                                            </td>
                                            <td>
                                                <div className="cell-content" style={{ color: trans.type === 'Income' ? 'green' : 'red' }}>
                                                    {trans.type === 'Expense' ? '-' : '+'}
                                                    ${trans.amount}
                                                </div>
                                            </td>
                                            <td style={{ color: trans.type === 'Income' ? 'green' : 'red' }}>
                                                <div className="cell-content">
                                                    {trans.type}
                                                </div>
                                            </td>
                                            <td>{trans.trans_date?.split('T')[0]}</td>
                                            <td>
                                                <div id="actionButtons" className="cell-content">
                                                    <button className="edit"><img src={edit} /></button>
                                                    <button className="edit" onClick={onDelete}><img src={del} /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="addTrans">
                            <h2>Add new transaction</h2>

                            <form className="form" onSubmit={handleSubmit(onSubmit)}>
                                <input type="number"
                                step="0.01"
                                    {...register("amount", { required: true, max: 999999 })}
                                    className="input"
                                    placeholder="0.00"
                                />
                                {errors.amount && (
                                    <span style={{ color: "red", fontSize: "12px" }}>
                                        Max amount is $999,999.
                                    </span>
                                )}

                                <select {...register("type", { required: true })}>
                                    <option value="">Select type</option>
                                    <option value="Income">Income</option>
                                    <option value="Expense">Expense</option>
                                </select>

                                <input type="text"
                                    {...register("description", { required: false })}
                                    maxLength="20"
                                    className="input"
                                    placeholder="Description"
                                />

                                <input id="submit" type="submit" value="Add"/>
                            </form>
                        </div>
                    </div>                
                    <div className="charts">
                        
                    </div>
                
                </div>

                

            </div>
        </div> 
        </>
    );
}

export default Homepage;