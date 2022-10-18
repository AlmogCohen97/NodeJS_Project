const mongoose = require('mongoose');
const { config } = require('../config/secret');
require("dotenv").config();

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect(`mongodb+srv://${config.userDb}:${config.passDb}@cluster0.82fmcvb.mongodb.net/Project`);
  console.log("mongo connect Project3")
}