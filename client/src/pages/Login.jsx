import { useState } from "react";
import { login } from "../services/authService";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [form, setform] = useState({ email: "", password: "" });
    const [error, seterror] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try{
            const res = await login(form);
            console.log("Login Successful", res)
        navigate("/dashboard");
        }catch(err){
            seterror("Invalid email or password");
        }
        
    }
    return (
        <form onSubmit={handleSubmit}>
            <h2>Login</h2>

             {error && <p style={{ color: "red" }}>{error}</p>}


            <input value={form.email} placeholder="Email" name="email"  onChange={e => setform({ ...form, email: e.target.value })} />
            <input value={form.password} type="password" name="password" placeholder="Passowrd" onChange={e => setform({ ...form, password: e.target.value })} />
            <button>Login</button>
        </form>
    );
};
export default Login;