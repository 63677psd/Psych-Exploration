let model;
let model_loaded = false;

let canvas_data;

const seven = [
	0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
	0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
	0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
	0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
	0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
	0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
	0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
	0,0,0,0,0,0,84,185,159,151,60,36,0,0,0,0,0,0,0,0,0,0,0,0,
	0,0,0,0,0,0,0,0,0,0,222,254,254,254,254,241,198,198,198,198,
	198,198,198,198,170,52,0,0,0,0,0,0,0,0,0,0,0,0,67,114,72,114,
	163,227,254,225,254,254,254,250,229,254,254,140,0,0,0,0,0,0,
	0,0,0,0,0,0,0,0,0,0,0,17,66,14,67,67,67,59,21,236,254,106,
	0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,83,253,209,
	18,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,22,233,255,
	83,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,129,254,
	238,44,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,59,249,
	254,62,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,133,
	254,187,5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,9,205,
	248,58,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,126,254,
	182,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,75,251,240,
	57,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,19,221,254,
	166,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,203,254,
	219,35,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,38,254,
	254,77,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,31,224,
	254,115,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,133,
	254,254,52,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,61,
	242,254,254,52,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
	121,254,254,219,40,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
	0,0,121,254,207,18,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
	0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0
];

async function load(){
	$("#load").text("Loading...");
	$("#load").prop("disabled", true);

	model = await tf.loadLayersModel("assets/mnist-model.json");

	model_loaded = true;
	$("#load").remove();
	$("#clear").css("display", "block");

}

function clear_number(){
	canvas_data = new Array(28).fill().map(x=>new Array(28).fill(0));
}

function draw_data(d, x, y, side){
	let index = 0;
	noStroke();

	for (let i=0; i<28; i++){
		for (let j=0; j<28; j++){
			let val = d.data[index++];
			fill(val);
			rect(x + j*side/28, y + i*side/28, side/28, side/28);
		}
	}
}

function setup(){
	let side_len = floor(min(windowHeight*0.9 - 50, windowWidth*0.9));
	side_len -= side_len%28;

	const canvas = createCanvas(side_len, side_len + 50);
	canvas.parent("sketch");

	canvas_data = new Array(28).fill().map(x=>new Array(28));
	let index = 0;
	for (let i=0; i<28; i++){
		for (let j=0; j<28; j++){
			canvas_data[i][j] = seven[index++];
		}
	}

	noStroke();
	textAlign(LEFT, CENTER);
	textSize(30);
}

function _in_grid(r, c){
	return r >= 0 && r < 28 && c >= 0 && c < 28;
}

function draw(){
	if (mouseIsPressed){
		if (mouseIn()){
			const row = floor((mouseY-50)/width*28);
			const col = floor(mouseX/width*28);
			if (row >= 0){
				canvas_data[row][col] = min(255, canvas_data[row][col] + 100);
				for (let dr=-1; dr<=1; dr++){
					for (let dc=-1; dc<=1; dc++){
						if (_in_grid(row + dr, col + dc) && !(dr==0 && dc==0)){
							canvas_data[row + dr][col + dc] = min(255, canvas_data[row + dr][col + dc] + 10);
						}
					}
				}
			}
		}
	}

	background(200);
	for (let i=0; i<28; i++){
		for (let j=0; j<28; j++){
			let val = canvas_data[i][j];
			fill(val);
			rect(j*width/28, i*width/28 + 50, width/28, width/28);
		}
	}
	if (model_loaded){
		let X = tf.tensor([canvas_data]).reshape([1,28,28,1]);
		let {indices, values} = tf.topk(model.predict(X), 3);
		indices = indices.dataSync();
		values = values.dataSync();

		let x = width/2 - 50;

		fill(0);
		text("Guess: ", width/2 - 50, 25);
		x += textWidth("Guess: ");

		fill(200 - 200*values[0]);
		text(indices[0], x, 25);
		x += textWidth(indices[0]);

		fill(200 - 200*values[1]);
		text(", " + indices[1], x, 25);
		x += textWidth(", " + indices[1]);

		fill(200 - 200*values[2]);
		text(", " + indices[2], x, 25);


	} else {
		text("Guess: ...", width/2 - 50, 25);
	}
}

function mouseIn(){
	return $("#code-view").attr("aria-hidden")=="true" && (mouseX > 0) && (mouseX < width) && (mouseY > 0) && (mouseY < height);
}

function windowResized(){
	let side_len = floor(min(windowHeight*0.9 - 50, windowWidth*0.9));
	side_len -= side_len%28;
	resizeCanvas(side_len, side_len + 50);
}