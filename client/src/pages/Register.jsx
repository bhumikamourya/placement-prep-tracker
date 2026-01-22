import { useState } from "react";
import { register } from "../services/authService";
import { useNavigate } from "react-router-dom";

const Register = () => {
    const [form, setform] = useState({
        name: "",
        email: "",
        password: "",
        targetRole: "SDE"
    });
    const navigate = useNavigate();
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        await register(form);
        navigate("/login");
    };
    return (
        <form onSubmit={handleSubmit}>
            <h2>Register</h2>
            <input placeholder="Name" onChange={e => setform({ ...form, name: e.target.value })} />
            <input placeholder="Email" onChange={e => setform({ ...form, email: e.target.value })} />
            <input placeholder="Password" onChange={e => setform({ ...form, password: e.target.value })} />
            <select onChange={e => setform({ ...form, targetRole: e.target.value })}>
                <option>Select</option>
                <option value="SDE">SDE</option>
                <option value="Analyst">Analyst</option>
                <option value="DSA">DSA</option>
                <option value="CS">CS</option>
            </select>
            <button>Register</button>
        </form>
    );
}
export default Register;