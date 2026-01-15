import { useState } from 'react';
import { addSkill } from '../services/skillService';
const AddSkill = ({ onAdd }) => {
    
    const [form, setform] = useState({
        category: "DSA",
        topicName: "",
        status: 0
    });
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.topicName.trim()) return;
        try {
            const newSkill = await addSkill(form);
            onAdd(newSkill);
            setform({
                category: "DSA",
                topicName: "",
                status :0,
            });
        }catch(err){
            alert("Failed to add Skill");
        }
    };
    return (
        <form onSubmit={handleSubmit}>
            <input placeholder='Topic Name' value={form.topicName} onChange={e => setform({ ...form, topicName: e.target.value })} required />
            <select value={form.category} onChange={e => setform({ ...form, category: e.target.value })} required>
                <option>DSA</option>
                <option>OS</option>
                <option>DBMS</option>
                <option>CN</option>
            </select>
            <select value={form.status} onChange={e => setform({ ...form, status: Number(e.target.value) })} required>
                <option value={0}>Not Started</option>
                <option value={1}>In Progress</option>
                <option value={2}>Strong</option>
            </select>
            <button type='submit'>Add</button>
        </form>
    );
};
export default AddSkill;