const indexR = require("./index");
const usersR = require("./users");
const itemsR = require("./items");

// Init of  API routes
exports.routesInit = (app) => {
    app.use("/",indexR);
    app.use("/users",usersR);
    app.use("/furnitures",itemsR);
}