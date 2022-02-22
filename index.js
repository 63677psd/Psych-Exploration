const express = require("express");
const pug = require("pug");

const app = express();
app.set('view engine', 'pug')

const PORT = 8000;


app.use("/scripts", express.static(__dirname + '/scripts'));


app.get('/', (req, res) => {

  res.render("example");

});


app.listen(PORT, () => {
  console.log("Running on port " + PORT);
});