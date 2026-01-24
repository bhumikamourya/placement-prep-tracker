const roleSkillsMap ={
    SDE:{
        DSA : ['Arrays' , 'Strings', 'Binary Search', 'Recursion','Linked List', 'Stacks', 'Queues', 'Trees' , 'Graphs', 'DP'],
        OS : ['Processes' , 'Threads' , 'Deadlock'],
        DBMS : ['Normalization', 'Indexes', 'Transactions'],
        CN :['TCP/IP', 'HTTP']
    },
    Analyst : {
        DSA : ['Arrays' , 'Basic Math'],
        DBMS :['SQL Joins', 'Indexes'],
        OS : [],
        CN : []
    },
    DSA :{
    DSA : ['Arrays', 'Strings', 'Binary Search' ,'Recursion' , 'Trees', 'Graphs' , 'DP'],
    OS : [],
    DBMS : [],
    cn :[]
    },
    CS :{
        DSA :['Arrays', 'Strings'],
        OS : ['Processes', 'Threads', 'Deadlock', 'Scheduling'],
        DBMS : ['Indexes', 'Transactions','Isolation Levels'],
        CN : ['TCP/IP', 'HTTP', 'DNS']
    }
};
module.exports = {
    getSkillsForRole : (role) =>{
        const skills = roleSkillsMap[role];
        if(!skills) console.warn(`Invalid role requested : ${role}`);
        return skills || {};
    }
}