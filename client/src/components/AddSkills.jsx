import { useState } from 'react';
import { addSkill } from '../services/skillService';
const AddSkill = ({ onAdd }) => {
    const [form, setform] = useState({
        category: "DSA",
        topicName: "",
        status: 0
    });
    const handleSubmit = async(e) =>{
        e.preventDefault();
        const newSkill = await addSkill(form);
        onAdd(newSkill);
    };
    return (
        <form onSubmit={handleSubmit}>
            <input placeholder='Topic Name' onChange={e => setform({ ...form, topicName: e.target.value })} />
            <select onChange={e => setform({ ...form, category: e.target.value })}>
                <option>DSA</option>
                <option>OS</option>
                <option>DBMS</option>
                <option>CN</option>
            </select>
            <select onChange={e => setform({ ...form, status: Number(e.target.value) })}>
                <option value={0}>Not Started</option>
                <option value={1}>In Progress</option>
                <option value={2}>Strong</option>
            </select>
            <button>Add</button>
        </form>
    );
};
export default AddSkill;