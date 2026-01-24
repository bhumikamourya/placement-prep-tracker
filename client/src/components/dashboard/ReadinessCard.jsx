const ReadinessCard = ({readiness})=>{
    const {current, last, delta} = readiness;

    let status = "Needs Improvement";

    if(current < 30) status = "High Risk";
    else if(current >= 60) status = "On Track";

    return(
        <div>
            <h3>Readiness</h3>
            <p>Current Score : {current}%</p>
            <p>Last Score : {last}%</p>
            <p>Delta :{delta > 0 ? `+${delta}` : delta}%</p>
            <strong>Status : {status}</strong>
        </div>
    )
};
export default ReadinessCard;