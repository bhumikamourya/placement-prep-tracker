import React from "react";

const ReadinessCard = ({ readiness }) => {
    const { current = 0, last = 0, delta = 0 } = readiness || {};

    // console.log("READINESS", readiness);

    let status = "Needs Improvement";
    if (current < 30) status = "High Risk";
    else if (current >= 60) status = "On Track";

    return (
        <div style={{ border: "1px solid #ddd", padding: "8px", margin: "8px 0" }}>
            <h3>Readiness</h3>
            <p>Current Score: {current}%</p>
            <p>Last Score: {last}%</p>
            <p>Delta: {delta > 0 ? `+${delta}` : delta}%</p>
            <strong>Status: {status}</strong>
        </div>
    );
};

export default ReadinessCard;
