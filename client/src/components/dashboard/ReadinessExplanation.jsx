import React from "react";

const ReadinessExplanation = ({explanation})=>{
    if(!Array.isArray(explanation)) return null;

    return (
        <div style={{border: "1px solid #ddd", padding: "12px",marginTop:"12px"}}>
            <h3>HowReadiness is Calculated</h3>

            {explanation.map((item, index) => (
                <div key={index} style={{marginBottom:"8px"}}>
                    <strong>{item.factor} ({item.weight}%)</strong>
                    <p style={{margin: "4px 0"}}>{item.description}</p>
                </div>
            ))}
        </div>
    )
}
export default ReadinessExplanation;