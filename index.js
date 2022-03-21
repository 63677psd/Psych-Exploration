const express = require("express");
const pug = require("pug");

const app = express();
app.set("view engine", "pug");
app.locals.basedir = require("path").join(__dirname, 'views');

const PORT = 8000;

// serve scripts folder
app.use("/static", express.static(__dirname + "/static"));

// create navbar
const navbar_info = {
  Introduction: {href:"/intro"},
  "First Steps": {
      Algorithms:{href: "/algorithms"},
      Heuristics:{href: "/heuristics"}
  },
  Learning: {
      "Supervised Learning":{href: "/supervised"},
      "Unsupervised Learning":{href: "/unsupervised"},
      "Reinforcement Learning":{href: "/reinforcement"}
  },
  "Neural Networks": {
    Perceptron: {href: "/perceptron"},
    "Feedforward NN": {href: "/feedforward"},
    "Convolutional NN": {href: "/convolutional"},
    "Object Detection": {href: "/object-detection"}
  },
  "Genetic Algorithms": {href: "/genetic"},
  "Language": {href: "/language"},
  "Creativity": {href: "/creativity"},
  "Conclusion": {href: "/conclusion"},
  Finn: {href: "/finn"}
};

// serve content pages

// map paths to files in the views folder
const pages = {
  "/": "intro.pug",
  "/intro": "intro.pug",
  "/algorithms": "first_steps/algorithms.pug",
  "/heuristics": "first_steps/heuristics.pug",
  "/perceptron": "neural_networks/perceptron.pug",
  "/feedforward": "neural_networks/feedforward.pug",
  "/convolutional": "neural_networks/convolutional.pug",
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