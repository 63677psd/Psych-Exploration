let model;
let epochs;

let weights;

let prev_loss;
function draw_scene(loss){
	if (loss != null){
		prev_loss = round(loss,3);
	}
	background(200);
	fill(0);
	noStroke();
	text(`Epochs: ${epochs}`,20,20);
	text(`Loss: ${prev_loss}`,20,50);
	draw_network(weights, null, width, height, 50, 10);
}

function create_model(){
	model = tf.sequential();
	model.add(tf.layers.dense({units: 6, inputShape: [2], activation:"sigmoid"}));
	model.add(tf.layers.dense({units: 6, activation:"sigmoid"}));
	model.add(tf.layers.dense({units: 1, activation:"sigmoid"}));
	model.compile({ optimizer: tf.train.adam(0.05), loss: 'meanSquaredError'});

}

let timeout_id;
function train_model(n=100){
	let X = [...new Array(n)].map(()=>[random(), random()]);
	let Y = X.map(x=>pow(x[0]-0.5,2) + pow(x[1]-0.5,2) < 0.25*0.25?[1]:[0]);
	model.fit(tf.tensor2d(X), tf.tensor2d(Y), {epochs: 10}).then((info)=>{
		weights = extract_weights(model);
		const ave_loss = info.history.loss.reduce((x,y)=>x+y)/info.history.loss.length;
		draw_scene(ave_loss);
		if (ave_loss > 0.01){
			epochs += 10;
			timeout_id = setTimeout(train_model, 100);
		}

	}).catch(()=>{});
}

function start(){
	$("#start").remove();
	$("#restart").css("display", "block");

	restart_sketch();
}

function restart_sketch(){
	clearTimeout(timeout_id);

	epochs = 0;
	prev_loss = 99;
	create_model();
	weights = extract_weights(model);


	draw_scene(null);

	train_model();
}

function setup(){
	const canvas = createCanvas(windowWidth*0.75,500);
	canvas.parent("sketch");

	textAlign(LEFT, TOP);
	textSize(20);

	background(200);

}

function mouseIn(){
	return $("#code-view").attr("aria-hidden")=="true" && (mouseX > 0) && (mouseX < width) && (mouseY > 0) && (mouseY < height);
}


function windowResized(){
	resizeCanvas(windowWidth*0.75, 500);
	draw_scene(null);
}