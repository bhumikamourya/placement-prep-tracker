import { useEffect, useState } from "react";
import { getPerformanceAnalytics } from "../services/performanceService";

const Performance = () => {
    const [data, setData] = useState([]);
    // const [loading, setLoading] = useState(true);
    // const [error, setError] = useState("");

    useEffect(() => {
                getPerformanceAnalytics().then(setData);
            },[])

return (
    <div>
        <h2>Performance History</h2>

        {data.length === 0 && <p>No performance data yet</p>}

        {data.map((p, i) => (
            <div key={i} style={{ border: "1px solid #ccc", margin: "8px", padding: "8px" }}>
                <p>Date : {new Date(p.date).toLocaleDateString()}</p>
                <p>Tasks : {p.tasksCompleted} / {p.tasksAssigned}</p>
                <p>Completion : {p.completionRate}%</p>
                <p>Avg Readiness : {p.avgReadinessScore}%</p>
            </div>
        ))}
    </div>
);
}
export default Performance;