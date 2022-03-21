let model_loaded = false;
let model;
let train_data, test_data;
let train_X, train_Y;
let test_X, test_Y;

async function read_csv(file){
	let res = await fetch(file);
	let text = await res.text();
	let data = text.split("\n");
	data = data.map(line => {
		let arr = line.split(",");
		let label = parseInt(arr.shift());
		return {label: label, data: arr.map(s => parseInt(s))};
	});
	data.pop();
	console.log(file + " loaded");
	return data;
}

function load_model(){
	model = tf.sequential();

	model.add(tf.layers.conv2d({
		inputShape: [28, 28, 1],
		kernelSize: 5,
		filters: 8,
		strides: 1,
		activation: 'relu'
	}));

	model.add(tf.layers.maxPooling2d({poolSize: [2, 2], strides: [2, 2]}));

	model.add(tf.layers.conv2d({
		kernelSize: 5,
		filters: 16,
		strides: 1,
		activation: 'relu'
	}));

	model.add(tf.layers.maxPooling2d({poolSize: [2, 2], strides: [2, 2]}));

	model.add(tf.layers.flatten());

	model.add(tf.layers.dense({
		units: 10,
		activation: 'softmax'
	}));

	model.compile({
		optimizer: tf.train.adam(),
		loss: 'categoricalCrossentropy',
		metrics: ['accuracy'],
	});



}

function parse_tf(data){
	X = tf.tensor2d(data.map(d => d.data)).reshape([data.length, 28, 28, 1]);
	Y = tf.oneHot(data.map(d => d.label), 10);
	return [X, Y];
}

function load(){
	$("#load").text("Loading...");
	$("#load").prop("disabled", true);

	load_model();

	Promise.all([read_csv("/static/assets/mnist_train.csv"), read_csv("/static/assets/mnist_test.csv")])
		.then(data_arr => {
			train_data = data_arr[0];
			test_data = data_arr[1];

			[train_X, train_Y] = parse_tf(train_data);
			[test_X, test_Y] = parse_tf(test_data);

			model_loaded = true;
			$("#load").remove();
			$("#clear").css("display", "block");

		});

}



function clear(){

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
	const canvas = createCanvas(windowWidth*0.75,500);
	canvas.parent("sketch");
}

function draw(){
	background(200);
	if (model_loaded){
		draw_data(test_data[11], 0, 0, 28*10);
	}
}

function mouseIn(){
	return $("#code-view").attr("aria-hidden")=="true" && (mouseX > 0) && (mouseX < width) && (mouseY > 0) && (mouseY < height);
}

function windowResized(){
	resizeCanvas(windowWidth*0.75, 500);
}