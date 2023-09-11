const db= require('../db')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config()


const userSignup =async (req,res)=>{
    try {
        const {user_email,password,confirm_password} = req.body
        
        if(!user_email || !password || !confirm_password)
            return res.status(400).send('All fields must be filled')

        if(password!=confirm_password){
            return res.status(400).send('Passwords do not match');
        }

        const client =await db.connect()
        const find_user = await client.query('SELECT * FROM users WHERE email=$1',[user_email])
        
        if(find_user?.rows[0]?.email){
            return res.status(400).send('Email Already Exists!');
        }
        
        const salt = await bcrypt.genSalt(10)
        const hashed_password = await bcrypt.hash(password,salt)

        const create_user = await client.query('INSERT INTO users VALUES($1, $2)',[user_email,hashed_password])

        const token = jwt.sign({user_email},process.env.JWT_SECRET,{expiresIn:'2d'})
        
        res.status(200).json({user_email,token})
        client.release()
    } catch (error) {
        res.status(500).json(error.message)
        // console.log(error);
    }
}


const userLogin = async (req,res) =>{

    try {

        const {user_email,password} = req.body
        
        if(!user_email || !password )
            return res.status(400).send('All fields must be filled')

        const client =await db.connect()
        const user = await client.query('SELECT * FROM users WHERE email=$1',[user_email])

        if(!user){
            return res.status(400).send('Email does not Exist!');
        }
        
        const compare = await bcrypt.compare(password, user?.rows[0]?.hashed_password)

        if(!compare)
            return res.status(400).send('Invalid Credentials!')

        const token = jwt.sign({user_email},process.env.JWT_SECRET,{expiresIn:'2d'})
        res.status(200).json({user_email,token})
        client.release()
        
    } catch (error) {
        res.status(500).json(error.message)
        console.log(error);
    }
}


module.exports = {userLogin,userSignup}