exports.getStartOfToday = () => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
};

exports.getTodayKey = () => {
    return new Date(new Date().setHours(0,0,0,0));
}

exports.getStartOfDaysAgo = (n) => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - n);
    return d;
};

exports.getEndOfToday = () => {
    const d = new Date();
    d.setHours(23, 59, 59, 999);
    return d;
};