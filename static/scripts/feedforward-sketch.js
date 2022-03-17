let model;

let inputs;
let weights;

function extract_weights(m){
	let layers = [];
	for (let i=0; i<m.layers.length; i++){
		let rows = m.getWeights()[2*i].shape[0];
		let cols = m.getWeights()[2*i].shape[1];

		let weight_data = m.getWeights()[2*i].dataSync();
		let weights = new Array(rows);
		for (let r=0; r<rows; r++){
			weights[r] = new Array(cols);
			for (let c=0; c<cols; c++){
				weights[r][c] = weight_data[r*cols + c];
			}
		}

		let bias_data = m.getWeights()[2*i + 1].dataSync();
		let bias = new Array(cols);
		for (let c=0; c<cols; c++){
			bias[c] = bias_data[c];
		}

		layers.push({weights:weights, bias});
	}

	return layers;
}

function arrow(x1, y1, x2, y2, head_length = 30, head_angle = PI/4){
	const dx = x2-x1;
	const dy = y2-y1;
	const angle = atan2(dy, dx);
	line(x1, y1, x2, y2);
	line(x2, y2, x2 + head_length*cos(angle + PI + head_angle/2), y2 + head_length*sin(angle + PI + head_angle/2));
	line(x2, y2, x2 + head_length*cos(angle + PI - head_angle/2), y2 + head_length*sin(angle + PI - head_angle/2));
}

function create_model(){
	model = tf.sequential();
	model.add(tf.layers.dense({units: 6, inputShape: [2], activation:"sigmoid"}));
	model.add(tf.layers.dense({units: 6, activation:"sigmoid"}));
	model.add(tf.layers.dense({units: 1, activation:"sigmoid"}));
	model.compile({ optimizer: tf.train.adam(0.03), loss: 'meanSquaredError'});

}

function train_model(n=100){
	let X = [...new Array(n)].map(()=>[random(), random()]);
	let Y = X.map(x=>pow(x[0]-0.5,2) + pow(x[1]-0.5,2) < 0.25*0.25?[1]:[0]);
	model.fit(tf.tensor2d(X), tf.tensor2d(Y), {epochs: 5, batchSize:32}).then((info)=>{
		weights = extract_weights(model);
		if (show){
			background(200);
			draw_network(weights, [mouseX/width, mouseY/height], width, height, 50, 10);
		}
		console.log(info.history.loss[4]);
		train_model();

	}).catch(()=>{});
}

function setup(){
	const canvas = createCanvas(windowWidth*0.75,500);
	canvas.parent("sketch");

	create_model();
	weights = extract_weights(model);

	train_model();

	frameRate(20);

}

function draw_network(weights, inputs, _width, _height, node_size=50, arrowhead_size=10){
	if (weights == undefined){
		return;
	}

	let num_layers = weights.length;

	let values = tf.tensor2d([inputs]);

	let num_outputs = 0;
	for (let layer=0; layer<num_layers; layer++){

		let values_arr = values.dataSync();

		let num_inputs = weights[layer].weights.length;
		num_outputs = weights[layer].weights[0].length;

		let input_x = (layer+1)*_width/(num_layers+2);
		let output_x = (layer+2)*_width/(num_layers+2);

		for (let i=0; i<num_inputs; i++){
			let input_y = (i+1)*_height/(num_inputs+1);
			stroke(0);
			strokeWeight(2);
			fill(255-values_arr[i]*255);

			ellipse(input_x, input_y, node_size, node_size);

			if (layer>0){
				let bias = weights[layer-1].bias[i];
				stroke(0,100,0);
				if (bias < 0){
					stroke(100,0,0);
				}
				strokeWeight(abs(bias));
				arrow(input_x, input_y - node_size/2 - 5, input_x, input_y - node_size/2, arrowhead_size);
			}


			for (let j=0; j<num_outputs; j++){
				let output_y = (j+1)*_height/(num_outputs+1);
				let weight = weights[layer].weights[i][j];
				stroke(0,100,0);
				if (weight < 0){
					stroke(100,0,0);
				}
				strokeWeight(abs(weight));
				arrow(input_x + node_size/2, input_y + node_size*(j+1)/(num_outputs+1) - node_size/2, output_x - node_size/2, output_y + node_size*(i+1)/(num_inputs+1) - node_size/2, arrowhead_size);
			}
		}

		values = model.layers[layer].apply(values);
	}


	for (let i=0; i<num_outputs; i++){
		let values_arr = values.dataSync();
		let output_x = (num_layers+1)*_width/(num_layers+2);
		let output_y = (i+1)*_height/(num_outputs+1);
		stroke(0);
		strokeWeight(2);
		fill(255-values_arr[i]*255);
		ellipse(output_x, output_y, node_size, node_size);

		let bias = weights[num_layers-1].bias[i];
		stroke(0,100,0);
		if (bias < 0){
			stroke(100,0,0);
		}
		strokeWeight(abs(bias));
		arrow(output_x, output_y - node_size/2 - 5, output_x, output_y - node_size/2, arrowhead_size);
	}
}
show = true;
function draw(){
	if (!show){
		for (let i=0; i<100; i++){
			noStroke();
			let input = [random(), random()];
			let pred = model.predict(tf.tensor2d([input])).dataSync()[0];
			fill(255-pred*255);
			ellipse(input[0]*width, input[1]*height, 5, 5);
		}
	}
}

function mousePressed(){
	show = !show;
}

function mouseIn(){
	return $("#code-view").attr("aria-hidden")=="true" && (mouseX > 0) && (mouseX < width) && (mouseY > 0) && (mouseY < height);
}


function windowResized(){
	resizeCanvas(windowWidth*0.75, 500);
}