import { useEffect, useState } from "react";
import { getSkills } from "../services/skillService";
import AddSkill from "../components/AddSkills";

const Skills = () => {
    const [skills, setSkills] = useState([]);

    useEffect(() => {
            getSkills().then(setSkills);
        }, []);
    //     getSkills().then(data => {
    //         console.log("RAW SKILLS:", data);
    //         setSkills(data);
    //     });
    // }, []);
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
                        <div key={skill._id}>
                            {skill.topicName} - {["Not Started", "In Progress", "Strong"][skill.status]}
                        </div>
                    ))}
                </div>
            )))}
        </div>
    );
};
export default Skills;