const OverviewCards = ({ user, study, mocks }) => {
    return (
        <div>
            <h3>Overview</h3>
            <p>Total Skills : {user.totalSkills}</p>
            <p>Weak Skills : {user.weakSkills}</p>
            
            <p>Total Tasks : {study.totalTasks}</p>
            <p>Completed Tasks : {study.completedTasks}</p>
            <p>Pending Tasks : {study.pendingTasks}</p>

            <p>Mocks Attempted : {mocks.totalMocks}</p>
        </div>

    );
}
export default OverviewCards;