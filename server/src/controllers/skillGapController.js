const {getSkillGapsService} = require("../services/skillGapService");

exports.getSkillGap = async (req, res) => {
    try {
        const gaps = await getSkillGapsService(req.user.id);
        res.json(gaps);
    } catch (err) {
        if (err.message === "INVALID_ROLE") {
            return res.status(400).json({ message: "Invalid target role" });
        }
        res.status(500).json({ message: "Server Error" });
    }
};
