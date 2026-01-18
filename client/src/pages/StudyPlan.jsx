import { useEffect, useState } from "react";
import {generateStudyPlan, getStudyPlan, markTaskDone } from "../services/studyPlanService";

const StudyPlan = ()=>{
    const [plan, setPlan] = useState(null);
    const [loading, setloading] = useState(true);
    

    useEffect(()=>{
        loadPlan();
    },[]);

    const loadPlan = async ()=>{
        try{
        const data  = await getStudyPlan();
        setPlan(data);
        }catch(err){
            if(err.response?.status === 404){
                const data = await generateStudyPlan();
                setPlan(data);
            }
        }finally{
            setloading(false);
        }
    };
        const handleComplete = async(taskId) =>{
            await markTaskDone(taskId);
            loadPlan();
        };
        if(loading) return <p>Generating study plan...</p>;
        if(!plan) return <p>No study plan for today</p>;
        return(
            <div>
                <h2>Smart Study Plan</h2>

                    <div key={plan.date} style={{marginBottom:"20px"}}>
                        <h3>{new Date(plan.date).toLocaleString()}</h3>

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
            </div>
        )
};
export default StudyPlan;