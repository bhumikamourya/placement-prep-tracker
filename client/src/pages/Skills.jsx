import { useEffect, useState } from "react";
import AddSkill from "../components/AddSkills";
import { getSkills, updateSkill } from "../services/skillService";

const Skills = () => {
    const [skills, setSkills] = useState([]);

    const handleUpdate = async (skillId, status, minutes = null) => {
        try {
            const payload = {status};
            if(minutes) payload.timeSpent = minutes;

            const updated = await updateSkill(skillId, payload);
            setSkills(prev => 
                prev.map(s => s._id === skillId ? updated : s));
        } catch (err) {
            alert("Failed to update skill");
        }
    };

    useEffect(() => {
        getSkills().then(setSkills);
    }, []);
    const grouped = skills.reduce((acc, skill) => {
        acc[skill.category] = acc[skill.category] || [];
        acc[skill.category].push(skill);
        return acc;
    }, {});

    return (
        <div>
            <h2>My Skills</h2>
            <AddSkill onAdd={(skill) => setSkills([...skills, skill])} />
            {Object.keys(grouped).map((category => (
                <div key={category}>
                    <h3>{category}</h3>
                    {grouped[category].map(skill => (
                        <div key={skill._id} style={{ border: "1px solid #ccc", padding: "10px", marginBottom: "8px" }}>
                            <strong>{skill.topicName}</strong>
                            <p>Status:
                                <select value={skill.status} onChange={(e)=> handleUpdate(skill._id, Number(e.target.value))}>
                                    <option value={0}>Not Started</option>
                                    <option value={1}>In Progress</option>
                                    <option value={2}>Strong</option>
                                </select>
                            </p>
                            <p>Time Spent: {skill.timeSpent} min</p>
                            <button onClick={() => handleUpdate(skill._id, skill.status, 30)}>+30 min Study</button>
                            <p>Last Updated: {" "}{skill.lastUpdated ? new Date(skill.lastUpdated).toLocaleDateString() : "Never"}</p>
                        </div>
                    ))}
                </div>
            )))}
        </div>
    );
};
export default Skills;