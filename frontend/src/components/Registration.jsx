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

    const onSubmit = async (data) => {
        try {
            const response = await fetch("http://localhost:3001/api/auth/register", {
                method: "POST",
                headers: {
                    "content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: data.name,
                    email: data.email,
                    password: data.password,
                })
            });

            const result = await response.json();

            if(response.ok) {
                alert("Registered successfully");
                navigate(ROUTES.LOGIN);
            }else {
                alert("failed: " + result.message);
            }
        } catch (err) {
            console.error("connection problem, ", err);
        }
    };

    return (
        <>
        <div className="logreg">
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
                    {errors.email && <span>email is mandatory</span>}

                    <p className="log">Password*</p>
                    <input type="password"
                        {...register("password", {required: true})}
                        placeholder="Password"
                        autoComplete="new-password"
                    />
                    {errors.password && <span>Password is mandatory</span>}

                    <p id="noacc">Already have an account?<img src={pic} /><Link to="/login" id="reglink">log in</Link></p>
                    <input type="submit" value="Create account" className="sub"/>
                </form>
            </div>
        </div>
        </>
    )
}

export default Register;