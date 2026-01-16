import { useEffect, useState } from "react";
import { getStudyPlan, markTaskDone } from "../services/studyPlanService";

const StudyPlan = ()=>{
    const [plan, setPlan] = useState(null);
    

    useEffect(()=>{
        loadPlan();
    },[]);

    const loadPlan = async ()=>{
        const data  = await getStudyPlan();
        setPlan(data);
    };
        const handleComplete = async(taskId) =>{
            await markTaskDone(taskId);
            loadPlan();
        };
        if(!plan) return <p>No study plan for today!</p>;
        return(
            <div>
                <h2>Smart Study Plan</h2>

                    <div key={plan.date} style={{marginBottom:"20px"}}>
                        <h3>{new Date(plan.date).toLocaleString()}</h3>

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