var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
const {Email,Student} = require('../Schema');
const {dbUrl,mongodb,MongoClient} = require('../dbConfig');


mongoose.connect(dbUrl)

router.get('/', async(req,res)=>{
  const emails = await Email.find();
  res.send(emails)
})

router.post('/email', async (req,res)=>{
  try{
    const email = await Email.create(req.body)
    res.send(email)
  }
  catch(error){
    res.json({message:error._message})
  }
})


module.exports = router;
