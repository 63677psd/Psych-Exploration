const express = require("express");
const pug = require("pug");

const app = express();
app.set("view engine", "pug");
app.locals.basedir = require("path").join(__dirname, 'views');

const PORT = 8000;

// serve scripts folder
app.use("/scripts", express.static(__dirname + "/scripts"));

// create navbar
const navbar_info = {
  Introduction: {href:"/intro"},
  "First Steps": {
      Algorithms:{href: "/algorithms"},
      Heuristics:{href: "/heuristics"}
  },
  "Neural Networks": {
    "Object Detection": {href: "/object-detection"}
  },
  Learning: {
      "Supervised Learning":{href: "/supervised"},
      "Unsupervised Learning":{href: "/unsupervised"},
      "Reinforcement Learning":{href: "/reinforcement"}
  },
  Finn: {href: "/finn"}
};

// serve content pages

// map paths to files in the views folder
const pages = {
  "/": "intro.pug",
  "/intro": "intro.pug",
  "/algorithms": "first_steps/algorithms.pug",
  "/heuristics": "first_steps/heuristics.pug",
  "/object-detection": "neural_networks/object_detection.pug",
  "/finn": "finn.pug"
};

for (const page in pages){
  app.get(page, (req, res) => {
    res.render(pages[page], {navbar_info:navbar_info});
  });
}

// 404 for everything else
app.get('*', function(req, res){
  res.status(404).send("Page not found");
});


app.listen(PORT, () => {
  console.log("Running on port " + PORT);
});