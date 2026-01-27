import react from "react";
import pic from '../../public/pic.png'
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../routes";
import "../App.css"
import "./Login.css"

function Register() {
    const {
        register,
        handleSubmit,
        formState: { errors},
    } = useForm();

    const navigate = useNavigate();

    const onSubmit = (data) => {
        const existingUser = JSON.parse(localStorage.getItem(data.email));
        if (existingUser) {
            console.log("email is already in use");
            return;
        }

        const userData = {
            name: data.name,
            email: data.email,
            password: data.password,
        };

        localStorage.setItem(data.email, JSON.stringify(userData));
        navigate(ROUTES.LOGIN);
    };

    return (
        <>
            <div className="loginform">
                <h2>Register</h2>

                <form className="form" onSubmit={handleSubmit(onSubmit)}>
                    <p className="log">Username*</p>
                    <input type="text" 
                        {...register("name", {required: true})}
                        placeholder="Username"
                        autoComplete="name"
                    />
                    {errors.name && <span>*Name* is mandatory</span>}
                    
                    <p className="log">Email address*</p>
                    <input type="email" 
                        {...register("email", {required: true})}
                        placeholder="Email"
                        autoComplete="email"
                    />
                    {errors.name && <span>email is mandatory</span>}

                    <p className="log">Password*</p>
                    <input type="password"
                        {...register("password", {required: true})}
                        placeholder="Password"
                        autoComplete="new-password"
                    />
                    {errors.name && <span>Password is mandatory</span>}

                    <p id="noacc">Already have an account?<img src={pic} /><Link to="/login" id="reglink">log in</Link></p>
                    <input type="submit" value="Create account" className="sub"/>
                </form>
            </div>
            
        </>
    )
}

export default Register;