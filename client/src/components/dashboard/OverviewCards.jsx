import React from "react";

const OverviewCards = ({ user = {}, study = {}, mocks = {} }) => {
    // console.log("USER", user);
    // console.log("STUDY", study);
    // console.log("MOCKS", mocks);
    return (
        <div style={{ border: "1px solid #ddd", padding: "8px", margin: "8px 0" }}>
            <h3>Overview</h3>
            <p>Total Skills: {user?.totalSkills ?? 0}</p>
            <p>Weak Skills: {user?.weakSkills ?? 0}</p>
            <p>Total Tasks: {study?.totalTasks ?? 0}</p>
            <p>Completed Tasks: {study?.completedTasks ?? 0}</p>
            <p>Pending Tasks: {study?.pendingTasks ?? 0}</p>
            <p>Mocks Attempted: {mocks?.totalMocks ?? 0}</p>
        </div>
    );
};

export default OverviewCards;
