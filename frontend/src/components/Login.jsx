import react from 'react';
import { useNavigate } from "react-router-dom";
import pic from '../../public/pic.png'
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { ROUTES } from "../routes";
import "../App.css"
import "./Login.css"

function Login() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const generateToken = () => {
        return crypto.randomUUID(); 
    };

    const navigate = useNavigate();

    const onSubmit = (data) => {
        const userData = JSON.parse(localStorage.getItem(data.email));
        if(userData){
            if(userData.password === data.password) {
                const token = generateToken();

                localStorage.setItem("authToken", token);
                localStorage.setItem("userEmail", data.email);

                navigate(ROUTES.HOME);
            }else {
                console.log("Wrong password");
            }
        } else {
            console.log("Email not registered");
        }
    }

    return (
        <>
            <div className="loginform">
                <h2>Login</h2>

                <form className="form" onSubmit={handleSubmit(onSubmit)}>

                    <p className="log">Email address</p>
                    <input type="email"
                        {...register("email", { required: true })}
                        className="input"
                        placeholder="Email"
                    />
                    {errors.name && <span>Email is mandatory</span>}

                    <div className="forgpw">
                        <p className="pw">Password</p><p id="forgotten">Forgot password?</p>
                    </div>

                    <input type="password"
                        {...register("password", { required: true })}
                        className="input"
                        placeholder="Password"
                    />
                    {errors.name && <span>Password is mandatory</span>}
                    

                    <input type="submit" value="Log in" className="sub"/>
                    <p id="noacc">Don't have an account?<img src={pic} /><Link to="/register" id="reglink">Register here</Link></p>
                </form>
            </div>
        </>
    );
}

export default Login;