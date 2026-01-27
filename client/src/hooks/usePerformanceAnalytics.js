import { useEffect, useState } from "react";
import { getPerformanceAnalytics } from "../services/performanceService";

export const usePerformanceAnalytics = () => {
    const [performance, setPerformance] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getPerformanceAnalytics()
            .then(setPerformance)
            .finally(() => setLoading(false));
    }, []);

    return { performance, loading };
};
