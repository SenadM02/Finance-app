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

    const navigate = useNavigate();

    const onSubmit = async (data) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    email: data.email,
                    password: data.password,
                })
            });

            const result = await response.json();

            if(response.ok) {
                localStorage.setItem("isLoggedIn", "true");

                navigate(ROUTES.HOME);
            }else {
                alert(result.message);
            }
        } catch(err) {
            console.error("error: ", err);
        }
    }

    return (
        <>
        <div className="logreg">
            <div className="loginform">
                <h2>Login</h2>

                <form className="form" onSubmit={handleSubmit(onSubmit)}>

                    <p className="log">Email address</p>
                    <input type="email"
                        {...register("email", { required: true })}
                        className="input"
                        placeholder="Email"
                    />
                    {errors.email && <span>Email is mandatory</span>}

                    <div className="forgpw">
                        <p className="pw">Password</p><p id="forgotten">Forgot password?</p>
                    </div>

                    <input type="password"
                        {...register("password", { required: true })}
                        className="input"
                        placeholder="Password"
                    />
                    {errors.password && <span>Password is mandatory</span>}
                    

                    <input type="submit" value="Log in" className="sub"/>
                    <p id="noacc">Don't have an account?<img src={pic} /><Link to="/register" id="reglink">Register here</Link></p>
                </form>
            </div>
        </div>    
        </>
    );
}

export default Login;