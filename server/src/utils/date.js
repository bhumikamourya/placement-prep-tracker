exports.getStartOfToday = ()=>{
    const d = new Date();
    d.setHours(0,0,0,0);
    return d;
};

exports.getEndOfToday = () => {
    const d = new Date();
    d.setHours(23, 59, 59, 999);
    return d;
};