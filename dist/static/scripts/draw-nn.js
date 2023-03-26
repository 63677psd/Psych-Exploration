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

function draw_network(weights, inputs, _width, _height, node_size=50, arrowhead_size=10){
	if (weights == undefined){
		return;
	}
	const track_values = inputs!=null;

	let num_layers = weights.length;

	let values;
	if (track_values){
		values = tf.tensor2d([inputs]);
	}

	let num_outputs = 0;
	for (let layer=0; layer<num_layers; layer++){

		let values_arr;
		if (track_values){
			values_arr = values.dataSync();
		}

		let num_inputs = weights[layer].weights.length;
		num_outputs = weights[layer].weights[0].length;

		let input_x = (layer+1)*_width/(num_layers+2);
		let output_x = (layer+2)*_width/(num_layers+2);

		for (let i=0; i<num_inputs; i++){
			let input_y = (i+1)*_height/(num_inputs+1);
			stroke(0);
			strokeWeight(2);
			fill(track_values ? 255-values_arr[i]*255 : 0);

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

		if (track_values){
			values = model.layers[layer].apply(values);
		}
	}


	for (let i=0; i<num_outputs; i++){
		let values_arr;
		if (track_values){
			values_arr = values.dataSync();
		}
		let output_x = (num_layers+1)*_width/(num_layers+2);
		let output_y = (i+1)*_height/(num_outputs+1);
		stroke(0);
		strokeWeight(2);
		fill(track_values ? 255-values_arr[i]*255 : 0);
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
