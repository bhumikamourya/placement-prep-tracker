import { useState, useEffect } from "react";
import api from "../services/api";

// Fetch only last 7 days of performance
export const useWeeklyPerformance = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchWeekly = async () => {
            try {
                const res = await api.get("/performance/weekly");
                setData(res.data); // last 7 days, sorted oldest -> newest
            } catch (err) {
                setError("Failed to fetch weekly performance");
            } finally {
                setLoading(false);
            }
        };
        fetchWeekly();
    }, []);

    return { data, loading, error };
};
