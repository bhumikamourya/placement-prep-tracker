import React from "react";

const FocusCard = ({message}) =>{
  if(!message) return null;

  const {level= "info", title = "Focus Area", summary= "", actions= []} = message;

  const colors = {
    info: "#2563eb",
    warning: "#facc15",
    danger: "#dc2626",
    success: "#16a34a"
  }
  const color = colors[level] || "#2563eb";

  return (
    <div
      style={{
        border: `2px solid ${color}`,
        padding: "14px",
        margin: "14px 0",
        borderRadius: "10px"
      }}
    >
      <h3 style={{ color }}>{title}</h3>

      {summary && (
        <p style={{ marginBottom: "8px", fontSize: "14px" }}>
          {summary}
        </p>
      )}

      {actions.length > 0 && (
        <ul style={{ paddingLeft: "18px" }}>
          {actions.map((action, i) => (
            <li key={i} style={{ marginBottom: "6px" }}>
              <strong>{action.label}</strong>
              <br />
              <span style={{ fontSize: "13px", opacity: 0.8 }}>
                {action.reason}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
export default FocusCard;