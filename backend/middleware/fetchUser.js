var jwt=require('jsonwebtoken');

const JWT_SECRET='Shifaisagoodgi@#l';

const fetchUser= (req,res,next)=>{
    //Get the user id from jwt token and add id to request object
    const token =req.header('auth-token');
    if(!token){
        return res.status(401).send({error: "Before console"});
    }
    try{
        const data=jwt.verify(token,JWT_SECRET);
        req.user = data; // Attach user information to request object
        next();
    }
    catch{
        return res.status(401).send({error: "Please authenticate using a valid token"});
    }
}

module.exports=fetchUser


