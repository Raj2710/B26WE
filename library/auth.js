const bcrypt = require("bcryptjs");
const JWT = require('jsonwebtoken');
const JWTD = require('jwt-decode')
const secret = "mkjfvihbojbhewh98wqu9wq099"
const hashing = async(value)=>{
    try{
        const salt = await bcrypt.genSalt(10);
        console.log('Salt',salt)
        const hash = await bcrypt.hash(value,salt);
        return hash
    }
    catch(error)
    {
        return error
    }
}

const hashCompare = async(password,hashValue)=>{
    try {
        return await bcrypt.compare(password,hashValue)
    } catch (error) {
        return error
    }
}

const createJWT = async({email})=>{
    return await JWT.sign({
        email
    },
    secret,
    {
        expiresIn:'1m'
    }
    )
}

const authentication = async(token)=>{
    const decode = JWTD(token)
    if(Math.round(new Date()/1000)<=decode.exp)
    {
        return {
            email:decode.email,
            validity:true
        }
    }
    else
    {
        return {
            email:decode.email,
            validity:false
        }
    }


}


const role = async(req,res,next)=>{
    switch(req.body.role){
        case 1:console.log('Admin')
                next();
                break;
        case 2:console.log('Student');
                next();
                break;
        default: res.send({
            message:"Invalid Role, 1-Admin and 2-Student"
        })
        break;
    }
}

const adminrole = async(req,res,next)=>{
    if(req.body.role==1)
        next();
    else{
        res.send({
            message:"Permission Denied"
        })
    }
}


module.exports={hashing,hashCompare,role,adminrole,createJWT,authentication}


// GET is written as HFU then what will be POST written as?
// +1
// QPTU