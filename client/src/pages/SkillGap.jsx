import { useEffect, useState } from "react";
import { getSkillGap } from "../services/skillGapService";

const SkillGap = () =>{
    const [gaps, setGaps] = useState([]);

    useEffect(()=>{
        getSkillGap().then(setGaps);
    },[]);
    return(
        <div>
            <h2>Skill gap Analysis</h2>
            {gaps.map((g, i)=>(
                <div key={i} style={{border : "1px solid #ccc", margin : "10px", padding : "10px"}}>
                    <h4>{g.topic}({g.category})</h4>
                    <p>Reason : {g.reason}</p>
                    <p>Priority: {g.priority}</p>
                    <p>Confidence : {g.confidenceScore}%</p>
                    <p>Suggested Action : {g.recommendation}</p>
                    <small>Source: {g.source}</small>

                </div>
            ))}
        </div>
    );
}
export default SkillGap;