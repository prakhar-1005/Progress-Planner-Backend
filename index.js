require('dotenv').config()
const express = require('express')
const cors = require('cors')
const todoRoutes = require('./routes/todoRoutes')
const userRoutes = require('./routes/userRoutes')

const app =express()

app.use(cors())
app.use(express.json())

//routes
app.use('/api/user',userRoutes)
app.use('/api/todos',todoRoutes)


app.listen(4000, ()=>{
    console.log("server is running on port 4000");
})