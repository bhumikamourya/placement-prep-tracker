import { useEffect, useState } from "react";
import { getReadiness } from "../services/readinessService";
import { getSkillGap } from "../services/skillGapService";
import { getMockAnalysis } from "../services/mockAnalysisService";
import api from "../services/api";


const Dashboard = () => {
    const [data, setdata] = useState(null);
    const [loading, setloading] = useState(true);
    const [error, seterror] = useState("");
    const [readiness, setReadiness] = useState(0);
    const [gaps, setGaps] = useState([]);
    const [mockAnalysis, setMockAnalysis] = useState(null);

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
                getMockAnalysis().then(setMockAnalysis);
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
            {mockAnalysis && (
                <div>
                    <h3>Mock Test Performance</h3>

                    {!mockAnalysis.hasMock ? (
                        <p>Attempt a mock test to see performance insights.</p>
                    ) : (
                        <>
                            <p>Accuracy: {mockAnalysis.accuracy}%</p>
                            <p>
                                Readiness Impact:{" "}
                                {mockAnalysis.readinessImpact > 0 ? "⬆️ +" : "⬇️ "}
                                {mockAnalysis.readinessImpact}%
                            </p>

                            {mockAnalysis.weakTopics.length > 0 && (
                                <>
                                    <h4>Weak Topics (from mocks)</h4>
                                    {mockAnalysis.weakTopics.map(t => (
                                        <div key={t}>{t}</div>
                                    ))}
                                </>
                            )}
                        </>
                    )}
                </div>
            )}
        </div>
    );
};
export default Dashboard;