const mongoose = require("mongoose");
const Joi = require("joi");

// Schema of item
let itemSchema = new mongoose.Schema({
    name:String,
    price:Number,
    info:String,
    category:String,
    color:String,
    pic:String,
    size: {
        height:Number,
        width:Number,
        length:Number
    },
    createdUser: String,
    date_created:{
      type:Date , default:Date.now()
    }
  })
  exports.ItemModel = mongoose.model("furnitures",itemSchema);
// Validtion of new item
  exports.validItem = (_reqBody) => {
    let joiSchema = Joi.object({
      name:Joi.string().min(2).max(99).required(),
      price:Joi.number().min(0).max(99999).required(), 
      info:Joi.string().min(2).max(500).allow(null,""),
      color:Joi.string().min(0).max(9999).required(), 
      category:Joi.string().min(0).max(9999).required(), 
      pic:Joi.string().min(0).max(9999).allow(null,""),
      size:Joi.object().keys({
        height:Joi.number().min(0).max(2000).required(),
        width:Joi.number().min(0).max(2000).required(),
        length:Joi.number().min(0).max(2000).required(),
      })
    })
    return joiSchema.validate(_reqBody);
  }