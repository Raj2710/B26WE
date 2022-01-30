var express = require('express');
const res = require('express/lib/response');
var router = express.Router();
const {hashing,hashCompare,role,adminrole,createJWT,authentication} = require('../library/auth')
const {dbUrl,mongodb,MongoClient} = require('../dbConfig');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/register',role,async(req,res)=>{
  const client = await MongoClient.connect(dbUrl)
  try{
   const db = await client.db('b26we');
   let user = await db.collection('auth').findOne({email:req.body.email})
   if(user)
   {
    res.json({
      message:"User already exists"
    })
  }
  else{
    const hash = await hashing(req.body.password);
    req.body.password = hash;
    let account = {
      email:req.body.email,
      password:hash,
      verify:'N'
    }
    let document = await db.collection('auth').insertOne(account);
    const token = await createJWT({email:req.body.email})

    res.json({
      message:'Account Created',
      emailVerifyToken:token
    })
  }
  }
  catch(error)
  {
     res.send(error)
  }
  finally{
    client.close();
  }
})

//admin login
router.post('/admin-login',async(req,res)=>{
  const client = await MongoClient.connect(dbUrl)
  try{
    const db = await client.db('b26we');
    let user = await db.collection('auth').findOne({email:req.body.email})
    if(user && user.verify=='Y')
    {
      const compare = await hashCompare(req.body.password,user.password);
      if(compare===true)
      {
        const token = await createJWT({email:req.body.email})
        res.json({
          message:'Admin Login Successfull',
          token
        })
      }
      else{
        res.json({
          message:'Wrong password'
        })
      }
    }else{
      res.json({
        message:'User does not exist/Account Not Activated'
      })
    }
  }

  catch(error)
  {
     res.send(error)
  }
  finally{
    client.close();
  }
})


router.post('/verify-token/:token',async(req,res)=>{
  const client = await MongoClient.connect(dbUrl)
  try {
    const validity = await authentication(req.params.token)
    if(validity.validity==true)
    {
      const db = await client.db('b26we');
      const user = await db.collection('auth').updateOne({email:validity.email},{$set:{verify:'Y'}})
      res.json({
        message:'Email Verified Successfully'
      })
    }
    else{
      res.json({
        message:"Token Expired"
      })
    }


  } catch (error) {
    console.log(error)
    res.json({
      message:"Error Occured"
    })
  }
})

//normal user login
router.post('/login',async(req,res)=>{
  const client = await MongoClient.connect(dbUrl)
  try{
    const db = await client.db('b26we');
    let user = await db.collection('auth').findOne({email:req.body.email})
    if(user)
    {
      const compare = await hashCompare(req.body.password,user.password);
      if(compare===true)
      {
        res.json({
          message:'Login Successfull'
        })
      }
      else{
        res.json({
          message:'Wrong password'
        })
      }
    }else{
      res.json({
        message:'User does not exist'
      })
    }
  }

  catch(error)
  {
     res.send(error)
  }
  finally{
    client.close();
  }
})

router.post('/forgot-password',async(req,res)=>{
  const client = await MongoClient.connect(dbUrl)
  try{
    const db = await client.db('b26we');
    let user = await db.collection('auth').findOne({email:req.body.email})
    if(user)
    {
      const hash = await hashing(req.body.password);
      let document = await db.collection('auth').updateOne({email:req.body.email},{$set:{password:hash}});
      res.json({
        message:'Password Changed Successfully'
      })
    }else{
      res.json({
        message:'User does not exist'
      })
    }
  }

  catch(error)
  {
     res.send(error)
  }
  finally{
    client.close();
  }
})


router.put('/reset-password',async(req,res)=>{
  const client = await MongoClient.connect(dbUrl)
  try{
    const db = await client.db('b26we');
    let user = await db.collection('auth').findOne({email:req.body.email})
    if(user)
    {
      const compare = await hashCompare(req.body.oldPassword,user.password);
      if(compare)
      {
        const hash = await hashing(req.body.newPassword);
        let document = await db.collection('auth').updateOne({email:req.body.email},{$set:{password:hash}});
        res.json({
          message:'Password Changed Successfully'
        })
      }
      else{
        res.json({
          message:'Incorrect Password'
        })
      }
    }else{
      res.json({
        message:'User does not exist'
      })
    }
  }
  catch(error)
  {
     res.send(error)
  }
  finally{
    client.close();
  }
})

module.exports = router;
