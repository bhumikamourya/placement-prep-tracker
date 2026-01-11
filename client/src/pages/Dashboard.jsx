import { useEffect, useState } from "react";
import api from "../services/api";


const Dashboard = () => {
    const [data, setdata] = useState(null);
    const [loading, setloading] = useState(true);
    const [error, seterror] = useState("");

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const res = await api.get("/dashboard");
                console.log(res.data);
                setdata(res.data);
            } catch (err) {
                seterror("Failed to load dashboard");
            } finally {
                setloading(false);
            }
        };
        fetchDashboard();
    }, []);

    if (loading) return <p>Loading dashboard...</p>
    if (error) return <p>{error}</p>

    return (
        <div>
            <h2>Hello, {data?.userName}👋</h2>
            <p>Total Skills: {data.totalSkills}</p>
            <p>Weak Skills: {data.weakSkills}</p> 
            <p>Total Tasks: {data.totalTasks}</p>
            <p>Completed Tasks: {data.completedTasks}</p>
            <p>Pending Tasks: {data.pendingTasks}</p>
        </div>
    );
};
export default Dashboard;