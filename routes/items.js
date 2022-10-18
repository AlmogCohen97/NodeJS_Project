
const express = require("express");
const { auth } = require("../middlewerare/auth");
const { ItemModel,validItem} =  require("../model/itemModel");
const router = express.Router();

// GET all items from all users
router.get("/all", async(req,res) => {
    let perPage =  Math.min(req.query.perpage, 20) || 5 ;
    let page = req.query.page || 1 ;
    let sort = req.query.sort || "_id" ;
    let reverse = req.query.reverse == "yes" ? -1 : 1 ;
    let data = await ItemModel
    .find({})
      .limit(perPage)
      .skip((page - 1) * perPage)
      .sort({[sort]:reverse})
     res.json(data);
})
// GET my items from my user with Token
router.get("/myshop",auth, async(req,res) => {
    let myId = req.tokenData._id;
    let perPage =  Math.min(req.query.perPage, 20) || 10 ;
    let page = req.query.page || 1 ;
    let sort = req.query.sort || "_id" ;
    let reverse = req.query.reverse == "yes" ? -1 : 1 ;
    let data = await ItemModel
    .find({createdUser:myId})
    .limit(perPage)
    .skip((page - 1) * perPage)
    .sort({[sort]:reverse})
    res.json(data);
})

//   Get by search => search?s=""
  router.get("/search", async (req, res) => {
    let perPage =  Math.min(req.query.perPage, 20) || 10 ;
    let page = req.query.page || 1 ;
    let sort = req.query.sort || "_id" ;
    let reverse = req.query.reverse == "yes" ? -1 : 1 ;
    try {
        let searchQ = req.query.s;
        let searchReg = new RegExp(searchQ, "i");
        let data = await ItemModel.find({ $or: [{ name: searchReg }, { color: searchReg },{ info: searchReg }] })
            .limit(perPage)
            .skip((page - 1) * perPage)
            .sort({[sort]:reverse})
        res.json(data);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ err: err });
    }
}) 
// Get by category => category/:catName
router.get("/category/:cat", async (req, res) => {
    let perPage =  Math.min(req.query.perPage, 20) || 10 ;
    let page = req.query.page || 1 ;
    let sort = req.query.sort || "_id" ;
    let reverse = req.query.reverse == "yes" ? -1 : 1 ;
    try {
        let searchQ = req.params.cat;
        let searchReg = new RegExp(searchQ, "i");
        let data
         = await ItemModel
            .find({ category: searchReg })
            .limit(perPage)
            .skip((page - 1) * perPage)
            .sort({[sort]:reverse})
        res.json(data);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ err: err });
    }
})
// Get by size => /size/height?minH=""&maxH=""
router.get("/size/height", async (req, res) => {
  let minW = req.query.minH || 0 ;
  let maxW = req.query.maxH || 2000 ;
  let minL = req.query.minH || 0 ;
  let maxL = req.query.maxH || 2000 ;
  try {
        let minH = req.query.minH || 0 ;
        let maxH = req.query.maxH || 2000 ;
        let data = await ItemModel.find({ $and: [{height: { $gte: minH } }, {height: { $lte: maxH } }] } )
            // .limit(perPage)
            // .skip((page - 1) * perPage)
            // .sort({ResizeObserverSize:reverse})
        res.json(data);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ err22: err });
    }
})
// GET by price range price => prices?min=""&max=""
router.get("/prices", async (req, res) => {
    let perPage =  Math.min(req.query.perPage, 20) || 10 ;
    let page = req.query.page || 1 ;
    let sort = req.query.sort || "_id" ;
    let reverse = req.query.reverse == "yes" ? -1 : 1 ;
    try {
        let min = req.query.min || 0;
        let max = req.query.max || 99999;
        let data = await ItemModel.find({ $and: [{ price: { $gte: min } }, { price: { $lte: max } }] })
            .limit(perPage)
            .skip((page - 1) * perPage)
            .sort({[sort]:reverse})
        res.json(data);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ err: err });
    }
})

// POST new item by Token
router.post("/" ,auth, async (req,res) => {
    let validBody = validItem(req.body);
    let user_id = req.tokenData._id;
    if(user_id == null || user_id == "undefined"){
        return res.status(401).json({msg:"User id is not found !"});
    }
    if(validBody.error){
      return res.status(400).json(validBody.error.details);
    }
    let item = new ItemModel(req.body);
    item.createdUser = user_id;
    await item.save();
    res.json(item);
  })
//   Edit item with a Token
  router.put("/:editId",auth, async(req,res) => {
    let validBody = validItem(req.body);
    if(validBody.error){
      return res.status(400).json(validBody.error.details);
    }
    try{
      let editId = req.params.editId;
      let data = await ItemModel.updateOne({_id:editId,user_id:req.tokenData._id},req.body)
      res.json(data);
    }
    catch(err){
      console.log(err);
      res.status(500).json({msg:"there error try again later",err})
    }
  })
//   Delete item with a Token
  router.delete("/:DelId",auth, async(req,res) => {
    try{
      let DelId = req.params.DelId;
      let data = await ItemModel.deleteOne({_id:DelId,user_id:req.tokenData._id});
      res.json(data);
    }
    catch(err){
      console.log(err);
      res.status(500).json({msg:"there error try again later",err})
    }
  })

module.exports = router;