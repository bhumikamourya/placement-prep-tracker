const FocusCard = ({message}) =>{
    if(!message) return null;

    return (
        <div>
            <h3>Focus Area</h3>
            <p>{message}</p>
        </div>
    );
};
export default FocusCard;