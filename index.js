const express = require("express");
const pug = require("pug");

const app = express();
app.set("view engine", "pug");
app.locals.basedir = require("path").join(__dirname);

const PORT = 8000;


app.use("/scripts", express.static(__dirname + "/scripts"));


const pages = ["example", "finn"];
const pages_regex = pages.reduce((x,y)=>x+"|"+y);

app.get(`/:page(${pages_regex})`, (req, res) => {
  res.render(req.params.page);

});


app.get('*', function(req, res){
  res.status(404).send("Page not found");
});


app.listen(PORT, () => {
  console.log("Running on port " + PORT);
});