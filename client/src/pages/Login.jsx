import { useState } from "react";
import { login } from "../services/authService";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [form, setform] = useState({ email: "", password: "" });
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        await login(form);
        navigate("/dashboard");
    }
    return (
        <form onSubmit={handleSubmit}>
            <h2>Login</h2>
            <input placeholder="Email" onChange={e => setform({ ...form, email: e.target.value })} />
            <input placeholder="Passowrd" onChange={e => setform({ ...form, password: e.target.value })} />
            <button>Login</button>
        </form>
    );
};
export default Login;