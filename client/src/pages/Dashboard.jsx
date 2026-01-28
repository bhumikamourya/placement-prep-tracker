import React, { useEffect, useState } from "react";
import api from "../services/api";

import OverviewCards from "../components/dashboard/OverviewCards";
import ReadinessCard from "../components/dashboard/ReadinessCard";
import FocusCard from "../components/dashboard/FocusCard";
import PerformanceChart from "../charts/performanceChart";
import { useWeeklyPerformance } from "../hooks/useWeeklyPerformance";
import { getLatestReadiness, getReadinessTrend } from "../services/readinessService";
import ReadinessChart from "../charts/ReadinessChart";
import ReadinessExplanation from "../components/dashboard/ReadinessExplanation";
import { getReadinessExplanation } from "../services/readinessService";

const Dashboard = () => {
    const { data: weeklyPerf, loading: perfLoading } = useWeeklyPerformance();

    const [dashboard, setDashboard] = useState(null);
    const [readiness, setReadiness] = useState({ current: 0, last: 0 });
    const [explanation, setExplanation] = useState([]);

    const [trend, setTrend] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    console.log("DASHBOARD DATA", dashboard)

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const Dashboardres = await api.get("/dashboard");
                setDashboard(Dashboardres.data);
                //readiness api's
                const latest = await getLatestReadiness();
                const trendRes = await getReadinessTrend();

                const trendData = trendRes.data || [];
                const lastScore = trendData.length >= 2 ? trendData[trendData.length - 2].score : 0;
                setReadiness({
                    current: latest.readinessScore,
                    last: lastScore
                });
                setTrend(trendData);

                const explainRes = await getReadinessExplanation();
                setExplanation(explainRes.explanation);
            } catch (err) {
                setError("Failed to load Dashboard");
            } finally {
                setLoading(false);
            }
        };
        fetchDashboard();
    }, []);

    if (loading) return <p>Loading dashboard...</p>;
    if (error) return <p>{error}</p>;
    if (!dashboard) return null;

    return (
        <div>
            <h2>Hello, {dashboard.user?.name ?? "User"} 👋</h2>

            <OverviewCards
                user={dashboard.user}
                study={dashboard.study}
                mocks={dashboard.mocks} />

            <ReadinessCard
                current={readiness.current}
                last={readiness.last} />
            <ReadinessChart data={trend} />
            <ReadinessExplanation explanation={explanation}/>


            {!perfLoading && Array.isArray(weeklyPerf) && weeklyPerf.length > 0 && (
                <PerformanceChart data={weeklyPerf} />
            )}

            <FocusCard message={dashboard.focusMessage} />
        </div>
    );
};

export default Dashboard;
