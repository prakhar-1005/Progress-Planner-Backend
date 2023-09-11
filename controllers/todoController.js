const db = require("../db");
const { v4: uuidv4 } = require('uuid');


const getTodos =async (req,res)=>{
    try {
        const client = await db.connect()
        let {userEmail} = req.params
        
        // The query below is a parameterized query. The '$1' in the query is a placeholder for a parameter, and the actual value of email is passed as an array when the query is executed. Parameterized queries are safe against SQL injection because the database driver ensures that the parameter values are properly escaped and sanitized
        const todos = await client.query('SELECT * FROM todos WHERE user_email=$1',[userEmail])  // -> Safe against SQL injection because the database driver handles parameter values properly


        // In the following form of query, we are directly interpolating the value of email into the query string using string template literals. While this might seem convenient, it's highly discouraged due to the risk of SQL injection. If the email variable contains malicious SQL code, it could be executed as part of the query, leading to security vulnerabilities.
        // const todos = await client.query(`SELECT * FROM todos WHERE user_email=${email}`); -> Not recommended as it is prone to SQL injection

        res.status(200).json(todos.rows)

        client.release()  // no await required here
        
        
    } catch (error) {
        res.status(500).json(error.message)
        console.log(error);
    }
}


const createTodo =async (req,res)=>{

    try {
        const id=uuidv4(); 

        const {user_email,title,progress,date} = req.body

        const client = await db.connect()

        const todoCreated= await client.query('INSERT INTO todos VALUES($1 , $2, $3, $4, $5)' ,[id,user_email,title,progress,date])

        res.status(200).send("Todo Created")
        
        client.release() 

    } catch (error) {
        res.status(500).json(error.message)
        console.log(error);
    }
}


const editTodos =async (req,res) =>{

    try {
        const {id}= req.params
        const {title,progress} = req.body
        const client = await db.connect()

        const todoEdited = await client.query('UPDATE todos SET title=$1, progress=$2 WHERE id=$3',[title,progress,id])

        res.status(200).send("Todo Edited")
        client.release()
    } catch (error) {
        res.status(500).json(error.message)
        console.log(error);
    }

}


const deleteTodos = async (req,res)=>{
    try {
        const {id} = req.params
        const client =await db.connect()

        const todoDeleted = await client.query('DELETE FROM todos where id=$1',[id])
        res.status(200).send("Todo Deleted")
        client.release()
    } catch (error) {
        res.status(500).json(error.message)
        console.log(error);
    }
}

 
module.exports  = {getTodos,createTodo,editTodos,deleteTodos}