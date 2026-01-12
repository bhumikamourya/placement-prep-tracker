import { useEffect, useState } from "react";
import { getReadiness, getSkillGap } from "../services/readinessService";
import api from "../services/api";


const Dashboard = () => {
    const [data, setdata] = useState(null);
    const [loading, setloading] = useState(true);
    const [error, seterror] = useState("");
    const [readiness, setReadiness] = useState(0);
    const [weakSkills, setWeakSkills] = useState([]);

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

    useEffect(()=>{
        getReadiness().then(data =>setReadiness(data.score));
        getSkillGap().then(setWeakSkills);
    },[]);

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
            <div>
                <h3>Readiness Score: {readiness}%</h3>
                <h3>Weak/Missing Skills:</h3>
                {weakSkills.map(skill => (
                    <div key={skill.topic}>
                        {skill.category}-{skill.topic}({["Not Started", "In Progress"][skill.status]})
                    </div>
                ))}
            </div>
        </div>
    );
};
export default Dashboard;