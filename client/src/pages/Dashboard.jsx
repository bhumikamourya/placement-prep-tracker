import { useEffect, useState } from "react";
import { getReadiness } from "../services/readinessService";
import { getSkillGap } from "../services/skillGapService";
import api from "../services/api";


const Dashboard = () => {
    const [data, setdata] = useState(null);
    const [loading, setloading] = useState(true);
    const [error, seterror] = useState("");
    const [readiness, setReadiness] = useState(0);
    const [gaps, setGaps] = useState([]);

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const res = await api.get("/dashboard");
                console.log(res.data);
                setdata(res.data);

                const readinessData = await getReadiness();
                setReadiness(readinessData.readinessScore ?? 0);
                const gapRes = await getSkillGap();
                setGaps(gapRes);
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
            {/* <p>Weak Skills: {weakSkills.length}</p> */}
            <p>Total Tasks: {data.totalTasks}</p>
            <p>Completed Tasks: {data.completedTasks}</p>
            <p>Pending Tasks: {data.pendingTasks}</p>

            <h3>Readiness Score: {readiness}%</h3>


            <h3>What to Study Next</h3>
            {gaps.map((gap, index) => (
                <div key={index}>
                    {gap.topic}({gap.category}) - Priority {gap.priority}
                </div>
            ))}
        </div>
    );
};
export default Dashboard;