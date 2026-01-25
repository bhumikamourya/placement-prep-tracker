// import { useEffect, useState } from "react";
// import { getReadiness } from "../services/readinessService";
// import { getSkillGap } from "../services/skillGapService";
// import { getMockAnalysis } from "../services/mockAnalysisService";
// import api from "../services/api";
// import { getReadinessTrend } from "../services/readinessTrendService";
// import { Link } from "react-router-dom";
// import { getPerformanceAnalytics } from "../services/performanceService";


// const Dashboard = () => {
//     const [data, setdata] = useState(null);
//     const [loading, setloading] = useState(true);
//     const [error, seterror] = useState("");
//     const [readinessIndex, setReadinessIndex] = useState(0);
//     const [gaps, setGaps] = useState([]);
//     const [mockAnalysis, setMockAnalysis] = useState(null);
//     const [trend, setTrend] = useState([]);
//     const [streak, setStreak] = useState(0);
//     const [performance, setPerformance] = useState([]);
//     const [readinessExplanation, setReadinessExplanation] = useState([]);

//     useEffect(() => {
//         const fetchDashboard = async () => {
//             try {
//                 const res = await api.get("/dashboard");  //which gets : userName, totalSkills , totalTasks, completedTasks
//                 console.log(res.data);
//                 setdata(res.data);

//                 const readinessData = await getReadiness();  // it calls skillGapservice.js  ->/skill-gap
//                 setReadinessIndex(readinessData.readinessScore ?? 0);

//                 const explanationRes = await api.get("/readiness/explain");
//                 setReadinessExplanation(explanationRes.data.explanation);

//                 try {
//                     const gapRes = await getSkillGap();
//                     setGaps(gapRes);
//                 } catch {
//                     setGaps([]);
//                 }
//                 try {
//                     const mock = await getMockAnalysis();
//                     setMockAnalysis(mock);
//                 } catch {
//                     setMockAnalysis([]);
//                 }

//                 const trendData = await getReadinessTrend();
//                 setTrend(trendData.history);
//                 setStreak(trendData.streak);

//                 try {
//                     const performance = await getPerformanceAnalytics();
//                     setPerformance(performance);
//                 } catch {
//                     setPerformance([]);
//                 }
//             } catch (err) {
//                 seterror("Failed to load dashboard");
//             } finally {
//                 setloading(false);
//             }
//         };
//         fetchDashboard();
//     }, []);


//     if (loading) return <p>Loading dashboard...</p>
//     if (error) return <p>{error}</p>
//     console.log("dashboard : ", data);

//     return (
//         <div>
//             <h2>Hello, {data?.userName}👋</h2>
//             <p>Total Skills: {data.user.totalSkills}</p>
//             <p>Weak Skills : {data.user.weakSkills}</p>

//             <p>Total Tasks: {data.study.totalTasks}</p>
//             <p>Completed Tasks : {data.study.completedTasks}</p>
//             <p>Pending Tasks : {data.study.pendingTasks}</p>

//             <p>Readiness Score: {data.readiness.current}%</p>
//             <p>Last Score : {data.readiness.last}%</p>
//             <p>Delta : {data.readiness.delta > 0 ? `+${data.readiness.delta}` : data.readiness.delta}%</p>
//             <p>Mocks Attempted: {data.mocks.totalMocks}</p>

//             {/* focus message */}
//             {data.focuesMessage &&(
//                 <div>
//                     <strong>Focus : </strong> {delta.focuesMessage}
//                 </div>
//             )}

//             {/* <h3>Readiness Score: {readinessIndex}</h3> */}

//             <h4>How readiness is calculated</h4>
//             {readinessExplanation.length === 0 ? (
//                 <p>No explanation available.</p>
//             ) : (
//                 <ul>
//                     {readinessExplanation.map((e, i) => (
//                         <li key={i}>{e}</li>
//                     ))}
//                 </ul>
//             )}

//             <h3>What to Study Next</h3>
//             {gaps.map((gap, index) => (
//                 <div key={index}>
//                     {gap.topic}({gap.category}) - Priority {gap.priority}
//                 </div>
//             ))}
//             {mockAnalysis && (
//                 <div>
//                     <h3>Mock Test Performance</h3>

//                     {!mockAnalysis.hasMock ? (
//                         <p>Attempt a mock test to see performance insights.</p>
//                     ) : (
//                         <>
//                             <p>Accuracy: {mockAnalysis.accuracy}%</p>
//                             <p>
//                                 Readiness Impact:{" "}
//                                 {mockAnalysis.readinessImpact > 0 ? "⬆️ +" : "⬇️ "}
//                                 {mockAnalysis.readinessImpact}%
//                             </p>

//                             {mockAnalysis.weakTopics.length > 0 && (
//                                 <>
//                                     <h4>Weak Topics (from mocks)</h4>
//                                     {mockAnalysis.weakTopics.map(t => (
//                                         <div key={t}>{t}</div>
//                                     ))}
//                                 </>
//                             )}
//                         </>
//                     )}
//                 </div>
//             )}

//             <h3>Consistency Streak: {streak} day</h3>

//             <h3>Readiness Trend</h3>
//             {trend.map((t, i) => (
//                 <div key={i}>
//                     {new Date(t.date).toLocaleDateString()} — {t.score}%
//                 </div>
//             ))}

//             <Link to="/study-plan">View Smart Study Plan -</Link>

//             <h3>Performance Over Time</h3>
//             {performance.map((p, i) => (
//                 <div key={i}>{new Date(p.date).toLocaleDateString()} - {p.completionRate}% tasks completed -
//                     Readiness : {p.avgReadinessScore}%
//                 </div>
//             ))}
//         </div>
//     );
// };
import { getPerformanceAnalytics } from "../services/performanceService";

import { useEffect, useState } from "react";
import api from "../services/api";

import OverviewCards from "../components/dashboard/OverviewCards";
import ReadinessCard from "../components/dashboard/ReadinessCard";
import FocusCard from "../components/dashboard/FocusCard";

const Dashboard = () => {

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const res = await api.get("/dashboard");
                setData(res.data);

                getPerformanceAnalytics().then(console.log);
            } catch (err) {
                setError("Failed to load Dashboard");
            } finally {
                setLoading(false);
            }
        };
        fetchDashboard();
    }, []);
    if (loading) return <p>Loading dashboard...</p>
    if (error) return <p>{error}</p>
    if(!data) return null;
    return (
        <>
            <h2>Hello, {data.user?.name ?? "User"} 👋</h2>

            <OverviewCards
            user ={data.user}
            study ={data.study}
            mocks={data.mocks}/>

            <ReadinessCard readiness={data.readiness}/>
            <FocusCard message={data.focusMessage}/>
            {/* <p>Total Skills: {data.user.totalSkills}</p>
            <p>Weak Skills: {data.user.weakSkills}</p>

            <p>Total Tasks: {data.study.totalTasks}</p>
            <p>Completed Tasks: {data.study.completedTasks}</p>
            <p>Pending Tasks: {data.study.pendingTasks}</p>

            <p>Readiness Score: {data.readiness.current}%</p>
            <p>Last Score: {data.readiness.last}%</p>

            <p>
                Delta: {" "}{data.readiness.delta > 0 ? `+${data.readiness.delta}` : data.readiness.delta}%
            </p>

            <p>Mocks Attempted: {data.mocks.totalMocks}</p>

            {data.focusMessage && (
                <div>
                    <strong>Focus:</strong> {data.focusMessage}
                </div>
            )} */}
        </>
    );
}
export default Dashboard;