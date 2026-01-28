import React, { useEffect, useState } from "react";
import api from "../services/api";

import OverviewCards from "../components/dashboard/OverviewCards";
import ReadinessCard from "../components/dashboard/ReadinessCard";
import FocusCard from "../components/dashboard/FocusCard";
import PerformanceChart from "../charts/performanceChart";
import { useWeeklyPerformance } from "../hooks/useWeeklyPerformance";

const Dashboard = () => {
    const { data: weeklyPerf, loading: perfLoading } = useWeeklyPerformance();

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    console.log("DASHBOARD DATA", data)
    console.log("PERFORMANCE RAW 👉", performance);

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const res = await api.get("/dashboard");
                setData(res.data);
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
    if (!data) return null;

    return (
        <div>
            <h2>Hello, {data.user?.name ?? "User"} 👋</h2>

            <OverviewCards user={data.user} study={data.study} mocks={data.mocks} />

            <ReadinessCard readiness={data.readiness} />


            {!perfLoading && Array.isArray(weeklyPerf) && weeklyPerf.length > 0 && (
                <PerformanceChart data={weeklyPerf} />
            )}

            <FocusCard message={data.focusMessage} />
        </div>
    );
};

export default Dashboard;
