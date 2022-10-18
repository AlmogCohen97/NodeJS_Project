
const http = require("http");
const path = require("path");
const cors = require("cors");
const express = require("express");
const {routesInit} = require("./routes/cofig_routes");
require("./db/mongosconnect");

const app = express();

app.use(express.json());

app.use(express.static(path.join(__dirname,"public")));
app.use(cors());

routesInit(app);

const server = http.createServer(app);

let port = process.env.PORT || 3000; 

server.listen(port);

console.log("server work!"); 