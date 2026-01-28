import { useEffect, useState } from "react";
import {generateStudyPlan, getStudyPlan, markTaskDone } from "../services/studyPlanService";
import {useNavigate} from "react-router-dom";

const StudyPlan = ()=>{
    const [plan, setPlan] = useState(null);
    const [loading, setloading] = useState(true);
    const navigate = useNavigate();
    

    useEffect(()=>{
        loadPlan();
    },[]);

    const loadPlan = async ()=>{
        try{
        const data  = await generateStudyPlan();
        setPlan(data);
        }catch(err){
            console.error(err);
        }finally{
            setloading(false);
        }
    };
        const handleComplete = async(taskId) =>{
            await markTaskDone(taskId);
            await loadPlan();
            navigate("/dashboard");
        };
        if(loading) return <p>Generating study plan...</p>;
        if(!plan) return <p>No study plan for today</p>;
        return(
            <div>
                <h2>Smart Study Plan</h2>

                {plan.tasks.length === 0 && (
                    <p>🎉 No tasks today. You are fully on track.</p>
                )}

                    <div key={plan.date} style={{marginBottom:"20px"}}>
                        <h3>{new Date(plan.date).toLocaleString("en-In")}</h3>

                        {plan.adjustmentNote &&(
                            <div style={{paddding : "10px" , background: "#fff3cd", marginBottom: "10px"}}>
                                {plan.adjustmentNote}
                            </div>
                        )}

                        {plan.tasks.map(task =>(
                            <div
                            key= {task._id}
                            style={{padding : "10px", 
                                border : "1px solid #ccc",
                                marginBottom :"8px"
                            }}>
                                <p><b>{task.topic}</b></p>
                                <p>Priority: {task.priority}</p>
                                <p>Status: {task.status}</p>

                                {task.status !== "DONE" && (
                                    <button onClick={()=>handleComplete(task._id)}>
                                        Mark Done
                                    </button>
                                )}
                            </div>
                        ))}

                    </div> 
                    {plan.decisionReasons?.length >0 && (
                        <>
                        <h4>Why this plan?</h4>
                        <ul>
                            {plan.decisionReasons.map((r, i)=>(
                                <li key={i}>{r}</li>
                            ))}
                        </ul>
                        </>
                    )}
            </div>
        )
};
export default StudyPlan;