var express = require('express');
var router = express.Router();
const {dbUrl,mongodb,MongoClient} = require('../dbConfig');

router.get('/all',async(req,res)=>{
  const client = await MongoClient.connect(dbUrl);
    try {
      const db = await client.db('b26we');
      let document = await db.collection('users').find().toArray();

      res.json({
        message:"Data fetched Successfully!",
        data:document
      })

    } catch (error) { 
      console.log(error);
      res.json({
        message:"Internal Server Error!"
      })
    }
    finally{
      client.close();
    }
})
router.post('/register', async(req, res)=> {
    const client = await MongoClient.connect(dbUrl);
    try {
      const db = await client.db('b26we');
      let user = await db.collection('users').findOne({email:req.body.email});

      if(user)
      {
        res.json({
          message:"User with same email exists"
        })
      }
      else{
        let document = await db.collection('users').insertOne(req.body);
        res.json({
          message:"User Registered Successfully!",
          document
        })
      }

    } catch (error) { 
      console.log(error);
      res.json({
        message:"Internal Server Error!"
      })
    }
    finally{
      client.close();
    }

});


router.put('/edit-user/:id',async(req,res)=>{
  const client = await MongoClient.connect(dbUrl);
  try {
    const db = await client.db('b26we');
    let document = await db.collection('users').findOneAndReplace({_id:mongodb.ObjectId(req.params.id)},req.body)
    if(document.value)
    {
      res.json({
        message:"Data Changed Successfully!",
        data:document
      })
    }
    else
    {
      res.status(404).json(({
        message:"Invalid Id"
      }));
    }

  } catch (error) { 
    console.log(error);
    res.json({
      message:"Internal Server Error!"
    })
  }
  finally{
    client.close();
  }

})


router.delete('/delete-user/:id',async(req,res)=>{
  const client = await MongoClient.connect(dbUrl);
  try {
    const db = await client.db('b26we');
    let document = await db.collection('users').findOneAndDelete({_id:mongodb.ObjectId(req.params.id)})
    if(document.value)
    {
      res.json({
        message:"Data Deleted Successfully",
      })
    }
    else
    {
      res.status(404).json(({
        message:"Invalid Id"
      }));
    }

  } catch (error) { 
    console.log(error);
    res.json({
      message:"Internal Server Error!"
    })
  }
  finally{
    client.close();
  }

})
module.exports = router;
