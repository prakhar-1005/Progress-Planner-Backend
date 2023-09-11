const jwt = require('jsonwebtoken')
const db= require('../db')

// 1) You're connecting to the PostgreSQL database using the db module.
// 2) You perform a query to retrieve the user's email from the 'users' table based on the user's email extracted from the JWT payload.
// 3) If the user is not found in the database, you return a 401 error.
// 4) If the user is found, you attach the user information to the req.user object.
// 5) At the end, you release the database connection client back to the pool using client.release() to avoid resource leaks.

const requireAuth =async (req,res,next) =>{

    const {authorization} = req.headers 

    if(!authorization){
        return res.status(401).json({error:'Authorization Token Required'})
    }

    const auth_token = authorization.split(' ')[1]  

    try {
// Verifying the token received from JWT using jwt.verify() with the jwt secret key gives back the payload (which  is email in this case)
        const response = jwt.verify(auth_token, process.env.JWT_SECRET) 

        const client = await db.connect()

        const result = await client.query('SELECT email FROM users WHERE email=$1',[response.user_email])
        // console.log(" this is result",result);
        if(result.rows.length==0){
            return res.status(401).json({ error: 'User not found' });  
        }

        req.user =result.rows[0]
        // console.log(req.user);
        // console.log(req.user.email);
        client.release();

        next()  // next() should be written here only as the next function should only run if authorization token is valid
    } catch (error) {
        console.log(error);
        return res.status(401).json({error: 'Request is not authorized'}) 
    }
}

module.exports={requireAuth}