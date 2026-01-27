import React from "react";

const FocusCard = ({ message }) => {
    if (!message) return null;
    const displayMessage = typeof message === "string" ?message : React.isValidElement(message)? message : JSON.stringify(message);

    return (
        <div style={{ border: "1px solid #ddd", padding: "8px", margin: "8px 0" }}>
            <h3>Focus Area</h3>
            <p>
                {displayMessage}
            </p>
        </div>
    );
};

export default FocusCard;
